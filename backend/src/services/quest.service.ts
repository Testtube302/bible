import { query } from '../db/postgres.js';
import { getLLMProvider } from '../llm/factory.js';
import { CHAPTER_QUESTIONS_PROMPT } from '../llm/prompts/questions.js';

// XP constants
const XP_PER_CHAPTER = 10;
const XP_PER_CORRECT_ANSWER = 5;
const XP_PER_JOURNEY_COMPLETE = 50;
const XP_PER_STREAK_DAY = 3;
const XP_PER_LEVEL = 100;

export interface QuestDashboard {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentStreak: number;
  chaptersRead: number;
  questionsAnswered: number;
  correctAnswers: number;
  achievements: AchievementInfo[];
}

export interface AchievementInfo {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ChapterQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  versesCited: string[];
}

export async function getTotalXP(): Promise<number> {
  const result = await query('SELECT COALESCE(SUM(xp_amount), 0) as total FROM quest_xp');
  return parseInt(result.rows[0].total, 10);
}

export function getLevel(totalXP: number): { level: number; xpToNextLevel: number } {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpToNextLevel = XP_PER_LEVEL - (totalXP % XP_PER_LEVEL);
  return { level, xpToNextLevel };
}

export async function awardXP(
  sourceType: string,
  sourceId: string,
  xpAmount: number
): Promise<void> {
  // Idempotent: check if already awarded
  const existing = await query(
    'SELECT id FROM quest_xp WHERE source_type = $1 AND source_id = $2',
    [sourceType, sourceId]
  );
  if (existing.rows.length > 0) return;

  await query(
    'INSERT INTO quest_xp (source_type, source_id, xp_amount) VALUES ($1, $2, $3)',
    [sourceType, sourceId, xpAmount]
  );
}

export async function awardChapterXP(bookName: string, chapter: number): Promise<void> {
  await awardXP('chapter_read', `${bookName}:${chapter}`, XP_PER_CHAPTER);
}

export async function awardStreakXP(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await awardXP('streak_bonus', today, XP_PER_STREAK_DAY);
}

export async function awardJourneyXP(journeyId: string): Promise<void> {
  await awardXP('journey_completed', journeyId, XP_PER_JOURNEY_COMPLETE);
}

export async function generateChapterQuestions(
  bookName: string,
  chapter: number
): Promise<ChapterQuestion[]> {
  // Check cache
  const cached = await query(
    'SELECT questions FROM chapter_questions WHERE book_name = $1 AND chapter = $2',
    [bookName, chapter]
  );
  if (cached.rows.length > 0) return cached.rows[0].questions;

  // Generate with LLM
  const llm = getLLMProvider();
  const prompt = CHAPTER_QUESTIONS_PROMPT
    .replace('{book}', bookName)
    .replace('{chapter}', String(chapter));

  const response = await llm.complete([
    { role: 'user', content: prompt },
  ]);

  // Parse JSON response (strip any markdown code fences)
  const cleaned = response.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
  let questions: ChapterQuestion[];
  try {
    questions = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse questions from LLM response');
  }

  // Cache
  await query(
    `INSERT INTO chapter_questions (book_name, chapter, questions)
     VALUES ($1, $2, $3)
     ON CONFLICT (book_name, chapter) DO UPDATE SET questions = $3, generated_at = NOW()`,
    [bookName, chapter, JSON.stringify(questions)]
  );

  return questions;
}

export async function submitAnswer(
  bookName: string,
  chapter: number,
  questionIndex: number,
  userAnswer: number
): Promise<{ correct: boolean; xpAwarded: number }> {
  const questions = await generateChapterQuestions(bookName, chapter);
  if (questionIndex >= questions.length) throw new Error('Invalid question index');

  const question = questions[questionIndex];
  const isCorrect = userAnswer === question.answer;

  await query(
    'INSERT INTO question_responses (book_name, chapter, question_index, user_answer, is_correct) VALUES ($1, $2, $3, $4, $5)',
    [bookName, chapter, questionIndex, userAnswer, isCorrect]
  );

  let xpAwarded = 0;
  if (isCorrect) {
    const sourceId = `${bookName}:${chapter}:q${questionIndex}`;
    await awardXP('question_answered', sourceId, XP_PER_CORRECT_ANSWER);
    xpAwarded = XP_PER_CORRECT_ANSWER;
  }

  return { correct: isCorrect, xpAwarded };
}

export async function getAllAchievements(): Promise<AchievementInfo[]> {
  const result = await query(
    `SELECT a.*, ap.unlocked, ap.unlocked_at
     FROM achievements a
     LEFT JOIN achievement_progress ap ON ap.achievement_id = a.id
     ORDER BY a.sort_order`
  );

  return result.rows.map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    category: row.category,
    xpReward: row.xp_reward,
    unlocked: row.unlocked ?? false,
    unlockedAt: row.unlocked_at?.toISOString() ?? null,
  }));
}

export async function checkAndUnlockAchievements(): Promise<AchievementInfo[]> {
  const achievements = await query('SELECT * FROM achievements');
  const newlyUnlocked: AchievementInfo[] = [];

  for (const ach of achievements.rows) {
    // Skip if already unlocked
    const progress = await query(
      'SELECT unlocked FROM achievement_progress WHERE achievement_id = $1',
      [ach.id]
    );
    if (progress.rows.length > 0 && progress.rows[0].unlocked) continue;

    const criteria = ach.criteria;
    let met = false;

    switch (criteria.type) {
      case 'chapters_read': {
        const result = await query(
          'SELECT COUNT(*) as count FROM reading_progress WHERE completed = TRUE'
        );
        met = parseInt(result.rows[0].count, 10) >= criteria.count;
        break;
      }
      case 'book_completed': {
        const result = await query(
          `SELECT COUNT(*) as count FROM reading_progress
           WHERE book_name = $1 AND completed = TRUE`,
          [criteria.book]
        );
        const bookChapters = await query(
          'SELECT chapter_count FROM bible_books WHERE name = $1',
          [criteria.book]
        );
        if (bookChapters.rows.length > 0) {
          met = parseInt(result.rows[0].count, 10) >= bookChapters.rows[0].chapter_count;
        }
        break;
      }
      case 'streak_days': {
        const streakResult = await query(
          'SELECT date FROM reading_streaks ORDER BY date DESC LIMIT $1',
          [criteria.days]
        );
        if (streakResult.rows.length >= criteria.days) {
          // Check consecutive
          let consecutive = true;
          for (let i = 1; i < streakResult.rows.length; i++) {
            const prev = new Date(streakResult.rows[i - 1].date);
            const curr = new Date(streakResult.rows[i].date);
            const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
            if (diff !== 1) { consecutive = false; break; }
          }
          met = consecutive;
        }
        break;
      }
      case 'correct_answers': {
        const result = await query(
          'SELECT COUNT(*) as count FROM question_responses WHERE is_correct = TRUE'
        );
        met = parseInt(result.rows[0].count, 10) >= criteria.count;
        break;
      }
      case 'journeys_completed': {
        const result = await query(
          'SELECT COUNT(*) as count FROM journey_progress WHERE completed = TRUE'
        );
        met = parseInt(result.rows[0].count, 10) >= criteria.count;
        break;
      }
      case 'first_action': {
        // Always met once the action is triggered
        met = true;
        break;
      }
    }

    if (met) {
      await query(
        `INSERT INTO achievement_progress (achievement_id, unlocked, unlocked_at)
         VALUES ($1, TRUE, NOW())
         ON CONFLICT (achievement_id) DO UPDATE SET unlocked = TRUE, unlocked_at = NOW()`,
        [ach.id]
      );
      await awardXP('achievement', ach.id, ach.xp_reward);
      newlyUnlocked.push({
        id: ach.id,
        slug: ach.slug,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        xpReward: ach.xp_reward,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}

export async function getQuestDashboard(): Promise<QuestDashboard> {
  const totalXP = await getTotalXP();
  const { level, xpToNextLevel } = getLevel(totalXP);

  const [streakResult, chaptersResult, answersResult] = await Promise.all([
    query('SELECT date FROM reading_streaks ORDER BY date DESC LIMIT 90'),
    query('SELECT COUNT(*) as count FROM reading_progress WHERE completed = TRUE'),
    query('SELECT COUNT(*) as total, SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct FROM question_responses'),
  ]);

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const row of streakResult.rows) {
    const dayDate = new Date(row.date);
    dayDate.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === currentStreak) currentStreak++;
    else break;
  }

  const achievements = await getAllAchievements();

  return {
    totalXP,
    level,
    xpToNextLevel,
    currentStreak,
    chaptersRead: parseInt(chaptersResult.rows[0].count, 10),
    questionsAnswered: parseInt(answersResult.rows[0].total ?? '0', 10),
    correctAnswers: parseInt(answersResult.rows[0].correct ?? '0', 10),
    achievements,
  };
}
