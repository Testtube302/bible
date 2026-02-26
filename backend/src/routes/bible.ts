import type { FastifyInstance } from 'fastify';
import * as bibleService from '../services/bible.service.js';
import type { Translation } from '../types/bible.js';

export async function bibleRoutes(app: FastifyInstance): Promise<void> {
  // GET /api/bible/books
  app.get('/bible/books', async () => {
    const books = await bibleService.getAllBooks();
    return { books };
  });

  // GET /api/bible/books/:testament
  app.get<{ Params: { testament: string } }>('/bible/books/:testament', async (request) => {
    const books = await bibleService.getBooksByTestament(request.params.testament);
    return { books };
  });

  // GET /api/bible/:book
  app.get<{ Params: { book: string } }>('/bible/:book', async (request, reply) => {
    const book = await bibleService.getBookInfo(request.params.book);
    if (!book) {
      return reply.status(404).send({ error: 'Book not found' });
    }
    const chapters = Array.from({ length: book.chapterCount }, (_, i) => i + 1);
    return { book, chapters };
  });

  // GET /api/bible/:book/:chapter
  app.get<{
    Params: { book: string; chapter: string };
    Querystring: { translation?: string };
  }>('/bible/:book/:chapter', async (request, reply) => {
    const chapter = parseInt(request.params.chapter, 10);
    if (isNaN(chapter)) {
      return reply.status(400).send({ error: 'Invalid chapter number' });
    }

    const translation = (request.query.translation?.toUpperCase() ?? 'KJV') as Translation;
    const verses = await bibleService.getChapter(request.params.book, chapter, translation);

    if (verses.length === 0) {
      return reply.status(404).send({ error: 'Chapter not found' });
    }

    return {
      book: request.params.book,
      chapter,
      translation,
      verses,
    };
  });

  // GET /api/bible/:book/:chapter/:verse
  app.get<{
    Params: { book: string; chapter: string; verse: string };
  }>('/bible/:book/:chapter/:verse', async (request, reply) => {
    const chapter = parseInt(request.params.chapter, 10);
    const verse = parseInt(request.params.verse, 10);
    if (isNaN(chapter) || isNaN(verse)) {
      return reply.status(400).send({ error: 'Invalid chapter or verse number' });
    }

    const translations = await bibleService.getVerse(request.params.book, chapter, verse);
    if (Object.keys(translations).length === 0) {
      return reply.status(404).send({ error: 'Verse not found' });
    }

    return { book: request.params.book, chapter, verse, translations };
  });

  // GET /api/bible/:book/:chapter/:verse/crossrefs
  app.get<{
    Params: { book: string; chapter: string; verse: string };
  }>('/bible/:book/:chapter/:verse/crossrefs', async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const verse = parseInt(request.params.verse, 10);
    const references = await bibleService.getCrossReferences(request.params.book, chapter, verse);
    return { references };
  });
}
