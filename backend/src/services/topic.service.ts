import { query } from '../db/postgres.js';
import { getCollection } from '../db/chromadb.js';
import { getLLMProvider } from '../llm/factory.js';
import { TOPIC_SUMMARY_PROMPT } from '../llm/prompts/topic.js';

export const PREDEFINED_TOPICS = [
  { slug: 'love', label: 'Love', description: 'What the Bible says about love and compassion' },
  { slug: 'faith', label: 'Faith', description: 'Trust and belief in God' },
  { slug: 'forgiveness', label: 'Forgiveness', description: 'Grace, mercy, and letting go' },
  { slug: 'prayer', label: 'Prayer', description: 'Communicating with God' },
  { slug: 'salvation', label: 'Salvation', description: 'Redemption and eternal life' },
  { slug: 'wisdom', label: 'Wisdom', description: 'Knowledge, discernment, and understanding' },
  { slug: 'suffering', label: 'Suffering', description: 'Pain, trials, and perseverance' },
  { slug: 'hope', label: 'Hope', description: 'Confidence in God\'s promises' },
  { slug: 'justice', label: 'Justice', description: 'Righteousness and fairness' },
  { slug: 'peace', label: 'Peace', description: 'Inner calm and harmony' },
  { slug: 'courage', label: 'Courage', description: 'Strength and boldness in faith' },
  { slug: 'creation', label: 'Creation', description: 'God as Creator of all things' },
  { slug: 'heaven', label: 'Heaven', description: 'The afterlife and God\'s kingdom' },
  { slug: 'sin', label: 'Sin', description: 'Wrongdoing and its consequences' },
  { slug: 'worship', label: 'Worship', description: 'Praising and honoring God' },
];

export interface TopicVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface TopicResult {
  topic: string;
  label: string;
  description: string;
  summary: string;
  versesCited: string[];
  verses: TopicVerse[];
}

export function getAllTopics() {
  return PREDEFINED_TOPICS;
}

export async function getTopicVerses(topic: string): Promise<TopicVerse[]> {
  try {
    const collection = await getCollection('bible_verses');
    const results = await collection.query({
      queryTexts: [topic],
      nResults: 15,
      where: { translation: 'KJV' },
    });

    if (!results.documents?.[0]) return [];

    return results.documents[0].map((doc, i) => {
      const meta = results.metadatas?.[0]?.[i] as any;
      return {
        book: meta?.book ?? '',
        chapter: meta?.chapter ?? 0,
        verse: meta?.verse ?? 0,
        text: doc ?? '',
        translation: 'KJV',
      };
    });
  } catch (err) {
    console.error('ChromaDB topic search failed:', err);
    return [];
  }
}

export async function getTopicSummary(topicSlug: string): Promise<TopicResult | null> {
  const topicInfo = PREDEFINED_TOPICS.find(t => t.slug === topicSlug);
  if (!topicInfo) return null;

  // Check cache
  const cached = await query(
    'SELECT summary, verses_cited FROM topic_summaries WHERE topic = $1',
    [topicSlug]
  );

  const verses = await getTopicVerses(topicInfo.label);

  if (cached.rows.length > 0) {
    return {
      topic: topicSlug,
      label: topicInfo.label,
      description: topicInfo.description,
      summary: cached.rows[0].summary,
      versesCited: cached.rows[0].verses_cited ?? [],
      verses,
    };
  }

  // Generate with LLM
  const versesContext = verses
    .map(v => `[${v.book} ${v.chapter}:${v.verse}] "${v.text}"`)
    .join('\n');

  const prompt = TOPIC_SUMMARY_PROMPT
    .replace('{topic}', topicInfo.label)
    .replace('{verses}', versesContext);

  const llm = getLLMProvider();
  const summary = await llm.complete([
    { role: 'user', content: prompt },
  ]);

  const versesCited = verses.map(v => `${v.book} ${v.chapter}:${v.verse}`);

  // Cache
  await query(
    `INSERT INTO topic_summaries (topic, summary, verses_cited)
     VALUES ($1, $2, $3)
     ON CONFLICT (topic) DO UPDATE SET summary = $2, verses_cited = $3, generated_at = NOW()`,
    [topicSlug, summary, versesCited]
  );

  return {
    topic: topicSlug,
    label: topicInfo.label,
    description: topicInfo.description,
    summary,
    versesCited,
    verses,
  };
}
