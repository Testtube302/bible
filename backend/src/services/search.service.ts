import { getCollection } from '../db/chromadb.js';
import { query as dbQuery } from '../db/postgres.js';
import type { SearchResult, Translation } from '../types/bible.js';

export async function semanticSearch(
  queryText: string,
  translation: Translation = 'KJV',
  testament?: string,
  limit: number = 20
): Promise<SearchResult[]> {
  const collection = await getCollection('bible_verses');

  const whereClause: any = { translation: { $eq: translation } };
  if (testament) {
    whereClause.testament = { $eq: testament.toUpperCase() };
  }

  const results = await collection.query({
    queryTexts: [queryText],
    nResults: Math.min(limit, 100),
    where: Object.keys(whereClause).length > 1
      ? { $and: Object.entries(whereClause).map(([k, v]) => ({ [k]: v })) }
      : whereClause,
  });

  if (!results.ids?.[0]?.length) return [];

  const searchResults: SearchResult[] = [];
  for (let i = 0; i < results.ids[0].length; i++) {
    const meta = results.metadatas?.[0]?.[i] as Record<string, any> | undefined;
    const distance = results.distances?.[0]?.[i] ?? 1;

    searchResults.push({
      book: (meta?.book as string) ?? '',
      chapter: (meta?.chapter as number) ?? 0,
      verse: (meta?.verse as number) ?? 0,
      text: results.documents?.[0]?.[i] ?? '',
      translation: (meta?.translation as Translation) ?? translation,
      score: 1 - distance, // convert distance to similarity score
    });
  }

  // Log analytics
  await dbQuery(
    'INSERT INTO analytics_events (event_type, event_data) VALUES ($1, $2)',
    ['search', JSON.stringify({ query: queryText, translation, testament, resultCount: searchResults.length })]
  ).catch(() => {}); // don't fail on analytics error

  return searchResults;
}
