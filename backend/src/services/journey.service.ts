import { query } from '../db/postgres.js';
import { getLLMProvider } from '../llm/factory.js';
import {
  JOURNEY_INTRO_PROMPT,
  JOURNEY_TRANSITION_PROMPT,
  JOURNEY_REFLECTION_PROMPT,
} from '../llm/prompts/journey.js';

export interface JourneyPassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  label: string;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  era: string | null;
  passages: JourneyPassage[];
  sortOrder: number;
}

export interface JourneyContent {
  contentType: string;
  position: number;
  content: string;
}

export interface JourneyProgress {
  currentPassage: number;
  completed: boolean;
}

export async function getAllJourneys(): Promise<(Journey & { progress: JourneyProgress | null })[]> {
  const result = await query(
    `SELECT j.*, jp.current_passage, jp.completed
     FROM journeys j
     LEFT JOIN journey_progress jp ON jp.journey_id = j.id
     ORDER BY j.sort_order`
  );

  return result.rows.map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    era: row.era,
    passages: row.passages,
    sortOrder: row.sort_order,
    progress: row.current_passage !== null
      ? { currentPassage: row.current_passage, completed: row.completed }
      : null,
  }));
}

export async function getJourney(slug: string): Promise<(Journey & { progress: JourneyProgress | null; content: JourneyContent[] }) | null> {
  const journeyResult = await query(
    `SELECT j.*, jp.current_passage, jp.completed
     FROM journeys j
     LEFT JOIN journey_progress jp ON jp.journey_id = j.id
     WHERE j.slug = $1`,
    [slug]
  );

  if (journeyResult.rows.length === 0) return null;

  const row = journeyResult.rows[0];

  const contentResult = await query(
    'SELECT content_type, position, content FROM journey_content WHERE journey_id = $1 ORDER BY content_type, position',
    [row.id]
  );

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    era: row.era,
    passages: row.passages,
    sortOrder: row.sort_order,
    progress: row.current_passage !== null
      ? { currentPassage: row.current_passage, completed: row.completed }
      : null,
    content: contentResult.rows.map(r => ({
      contentType: r.content_type,
      position: r.position,
      content: r.content,
    })),
  };
}

function formatPassage(p: JourneyPassage): string {
  if (p.verseStart === p.verseEnd) {
    return `${p.book} ${p.chapter}:${p.verseStart}`;
  }
  return `${p.book} ${p.chapter}:${p.verseStart}-${p.verseEnd}`;
}

export async function generateJourneyContent(journeyId: string): Promise<void> {
  // Check if content already exists
  const existing = await query(
    'SELECT COUNT(*) as count FROM journey_content WHERE journey_id = $1',
    [journeyId]
  );
  if (parseInt(existing.rows[0].count, 10) > 0) return;

  const journeyResult = await query('SELECT * FROM journeys WHERE id = $1', [journeyId]);
  if (journeyResult.rows.length === 0) throw new Error('Journey not found');

  const journey = journeyResult.rows[0];
  const passages: JourneyPassage[] = journey.passages;
  const llm = getLLMProvider();

  // Generate introduction
  const introPrompt = JOURNEY_INTRO_PROMPT
    .replace('{title}', journey.title)
    .replace('{description}', journey.description)
    .replace('{passageList}', passages.map(formatPassage).join(', '));

  const introText = await llm.complete([
    { role: 'user', content: introPrompt },
  ]);

  await query(
    `INSERT INTO journey_content (journey_id, content_type, position, content)
     VALUES ($1, 'introduction', 0, $2)
     ON CONFLICT (journey_id, content_type, position) DO UPDATE SET content = $2`,
    [journeyId, introText]
  );

  // Generate transitions between passages
  for (let i = 0; i < passages.length - 1; i++) {
    const transPrompt = JOURNEY_TRANSITION_PROMPT
      .replace('{title}', journey.title)
      .replace('{previousPassage}', `${formatPassage(passages[i])} — ${passages[i].label}`)
      .replace('{nextPassage}', `${formatPassage(passages[i + 1])} — ${passages[i + 1].label}`);

    const transText = await llm.complete([
      { role: 'user', content: transPrompt },
    ]);

    await query(
      `INSERT INTO journey_content (journey_id, content_type, position, content)
       VALUES ($1, 'transition', $2, $3)
       ON CONFLICT (journey_id, content_type, position) DO UPDATE SET content = $3`,
      [journeyId, i, transText]
    );
  }

  // Generate reflections (~every 3 passages)
  const reflectionInterval = 3;
  for (let i = reflectionInterval - 1; i < passages.length; i += reflectionInterval) {
    const coveredPassages = passages.slice(0, i + 1).map(formatPassage).join(', ');
    const reflPrompt = JOURNEY_REFLECTION_PROMPT
      .replace('{title}', journey.title)
      .replace('{coveredPassages}', coveredPassages)
      .replace('{currentPassage}', `${formatPassage(passages[i])} — ${passages[i].label}`);

    const reflText = await llm.complete([
      { role: 'user', content: reflPrompt },
    ]);

    await query(
      `INSERT INTO journey_content (journey_id, content_type, position, content)
       VALUES ($1, 'reflection', $2, $3)
       ON CONFLICT (journey_id, content_type, position) DO UPDATE SET content = $3`,
      [journeyId, i, reflText]
    );
  }

  // Initialize progress
  await query(
    `INSERT INTO journey_progress (journey_id, current_passage)
     VALUES ($1, 0)
     ON CONFLICT (journey_id) DO NOTHING`,
    [journeyId]
  );
}

export async function updateProgress(slug: string, currentPassage: number): Promise<void> {
  const journeyResult = await query('SELECT id, passages FROM journeys WHERE slug = $1', [slug]);
  if (journeyResult.rows.length === 0) throw new Error('Journey not found');

  const journey = journeyResult.rows[0];
  const passages: JourneyPassage[] = journey.passages;
  const completed = currentPassage >= passages.length - 1;

  await query(
    `INSERT INTO journey_progress (journey_id, current_passage, completed, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (journey_id) DO UPDATE SET current_passage = $2, completed = $3, updated_at = NOW()`,
    [journey.id, currentPassage, completed]
  );
}
