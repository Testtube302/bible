import { getCollection } from '../db/chromadb.js';
import { query as pgQuery } from '../db/postgres.js';
import { getLLMProvider } from '../llm/factory.js';
import { BASE_SYSTEM_PROMPT, CONTEXT_PLACEHOLDER } from '../llm/prompts/system.js';
import { SCRIPTURE_ONLY_PROMPT } from '../llm/prompts/scripture-only.js';
import { EXPLAIN_PROMPT } from '../llm/prompts/explain.js';
import { DEBATE_PROMPT } from '../llm/prompts/debate.js';
import type { ChatMessage, ChatMode, LLMStreamChunk, VerseContext } from '../types/chat.js';

interface RetrievedVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

function getModePrompt(mode: ChatMode): string {
  switch (mode) {
    case 'scripture_only': return SCRIPTURE_ONLY_PROMPT;
    case 'explain': return EXPLAIN_PROMPT;
    case 'debate': return DEBATE_PROMPT;
  }
}

// Parse explicit verse references like "Galatians 4:4", "1 John 3:16", "Genesis 1:1-3"
function parseVerseReferences(text: string): Array<{ book: string; chapter: number; verses: number[] }> {
  const pattern = /(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?/g;
  const refs: Array<{ book: string; chapter: number; verses: number[] }> = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const book = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const startVerse = parseInt(match[3], 10);
    const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;
    const verses: number[] = [];
    for (let v = startVerse; v <= Math.min(endVerse, startVerse + 10); v++) {
      verses.push(v);
    }
    refs.push({ book, chapter, verses });
  }
  return refs;
}

export async function retrieveSources(
  userMessage: string,
  verseContext?: VerseContext
): Promise<RetrievedVerse[]> {
  const versesCollection = await getCollection('bible_verses');

  // Retrieve relevant verses via semantic search
  const results = await versesCollection.query({
    queryTexts: [userMessage],
    nResults: 20,
    where: { translation: { $eq: 'KJV' } },
  });

  const verses: RetrievedVerse[] = [];

  if (results.ids?.[0]) {
    for (let i = 0; i < results.ids[0].length; i++) {
      const meta = results.metadatas?.[0]?.[i] as Record<string, any> | undefined;
      verses.push({
        book: (meta?.book as string) ?? '',
        chapter: (meta?.chapter as number) ?? 0,
        verse: (meta?.verse as number) ?? 0,
        text: results.documents?.[0]?.[i] ?? '',
        translation: (meta?.translation as string) ?? 'KJV',
      });
    }
  }

  // If user is asking about a specific verse, prepend it
  if (verseContext) {
    const id = `${verseContext.translation}_${verseContext.book.replace(/\s+/g, '_')}_${verseContext.chapter}_${verseContext.verse}`;
    try {
      const specific = await versesCollection.get({ ids: [id] });
      if (specific.documents?.[0]) {
        const meta = specific.metadatas?.[0] as Record<string, any> | undefined;
        verses.unshift({
          book: verseContext.book,
          chapter: verseContext.chapter,
          verse: verseContext.verse,
          text: specific.documents[0],
          translation: verseContext.translation,
        });
      }
    } catch {
      // specific verse not found
    }
  }

  // Parse explicit verse references from the user's message and fetch them directly
  const explicitRefs = parseVerseReferences(userMessage);
  for (const ref of explicitRefs) {
    const idsToFetch = ref.verses.map(
      v => `KJV_${ref.book.replace(/\s+/g, '_')}_${ref.chapter}_${v}`
    );
    try {
      const explicit = await versesCollection.get({ ids: idsToFetch });
      if (explicit.documents) {
        for (let i = 0; i < explicit.documents.length; i++) {
          if (!explicit.documents[i]) continue;
          const meta = explicit.metadatas?.[i] as Record<string, any> | undefined;
          const alreadyExists = verses.some(
            v => v.book === ref.book && v.chapter === ref.chapter && v.verse === ref.verses[i]
          );
          if (!alreadyExists) {
            verses.unshift({
              book: ref.book,
              chapter: ref.chapter,
              verse: ref.verses[i],
              text: explicit.documents[i]!,
              translation: (meta?.translation as string) ?? 'KJV',
            });
          }
        }
      }
    } catch {
      // verse not found in ChromaDB
    }
  }

  // Enrich top 3 results with cross-references (parallelized)
  try {
    const topVerses = verses.slice(0, 3);

    // Fetch all cross-references in parallel
    const xrefResults = await Promise.all(
      topVerses.map(v =>
        pgQuery(
          `SELECT to_book, to_chapter, to_verse_start FROM cross_references
           WHERE from_book = $1 AND from_chapter = $2 AND from_verse = $3
           ORDER BY votes DESC LIMIT 3`,
          [v.book, v.chapter, v.verse]
        )
      )
    );

    // Collect all cross-ref IDs to fetch in a single batch
    const xrefIds: string[] = [];
    const xrefMeta: Array<{ book: string; chapter: number; verse: number }> = [];
    for (const result of xrefResults) {
      for (const row of result.rows) {
        const id = `KJV_${(row.to_book as string).replace(/\s+/g, '_')}_${row.to_chapter}_${row.to_verse_start}`;
        const alreadyExists = verses.some(
          v => v.book === row.to_book && v.chapter === row.to_chapter && v.verse === row.to_verse_start
        );
        if (!alreadyExists && !xrefIds.includes(id)) {
          xrefIds.push(id);
          xrefMeta.push({ book: row.to_book, chapter: row.to_chapter, verse: row.to_verse_start });
        }
      }
    }

    // Single batch fetch from ChromaDB
    if (xrefIds.length > 0) {
      const xrefVerses = await versesCollection.get({ ids: xrefIds });
      if (xrefVerses.documents) {
        for (let i = 0; i < xrefVerses.documents.length; i++) {
          if (!xrefVerses.documents[i]) continue;
          const xMeta = xrefVerses.metadatas?.[i] as Record<string, any> | undefined;
          verses.push({
            book: xrefMeta[i].book,
            chapter: xrefMeta[i].chapter,
            verse: xrefMeta[i].verse,
            text: xrefVerses.documents[i]!,
            translation: (xMeta?.translation as string) ?? 'KJV',
          });
        }
      }
    }
  } catch {
    // cross_references table may not exist yet
  }

  return verses;
}

export async function* generateResponse(
  userMessage: string,
  mode: ChatMode,
  conversationHistory: ChatMessage[],
  verseContext?: VerseContext,
  prefetchedVerses?: RetrievedVerse[]
): AsyncIterable<LLMStreamChunk> {
  const verses = prefetchedVerses ?? await retrieveSources(userMessage, verseContext);

  // Build context string
  const contextStr = verses
    .map(v => `[${v.book} ${v.chapter}:${v.verse} (${v.translation})] "${v.text}"`)
    .join('\n');

  // Assemble system prompt
  const systemPrompt = BASE_SYSTEM_PROMPT.replace(CONTEXT_PLACEHOLDER, contextStr) + '\n' + getModePrompt(mode);

  // Build message array
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10), // last 10 messages for context window
    { role: 'user', content: userMessage },
  ];

  // Stream through LLM
  const provider = getLLMProvider();
  yield* provider.stream(messages);
}
