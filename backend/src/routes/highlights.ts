import type { FastifyInstance } from 'fastify';
import * as highlightService from '../services/highlight.service.js';

export async function highlightRoutes(app: FastifyInstance): Promise<void> {
  app.get('/highlights', async () => {
    const highlights = await highlightService.getAllHighlights();
    return { highlights };
  });

  app.get<{
    Params: { book: string; chapter: string };
  }>('/highlights/:book/:chapter', async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const highlights = await highlightService.getChapterHighlights(request.params.book, chapter);
    return { highlights };
  });

  app.post<{
    Body: {
      book_name: string;
      chapter: number;
      verse_start: number;
      verse_end: number;
      translation?: string;
      color?: string;
    };
  }>('/highlights', async (request, reply) => {
    const { book_name, chapter, verse_start, verse_end, translation, color } = request.body;

    if (!book_name || !chapter || !verse_start || !verse_end) {
      return reply.status(400).send({ error: 'book_name, chapter, verse_start, and verse_end are required' });
    }

    const highlight = await highlightService.createHighlight(
      book_name, chapter, verse_start, verse_end, translation ?? 'KJV', color ?? 'gold'
    );
    return reply.status(201).send({ highlight });
  });

  app.delete<{ Params: { id: string } }>('/highlights/:id', async (request, reply) => {
    const deleted = await highlightService.deleteHighlight(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Highlight not found' });
    }
    return { success: true };
  });
}
