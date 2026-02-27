import type { FastifyInstance } from 'fastify';
import * as bookmarkService from '../services/bookmark.service.js';

export async function bookmarkRoutes(app: FastifyInstance): Promise<void> {
  app.get('/bookmarks', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const bookmarks = await bookmarkService.getAllBookmarks(request.userId!);
    return { bookmarks };
  });

  app.post<{
    Body: {
      book_name: string;
      chapter: number;
      verse: number;
      translation?: string;
      note?: string;
    };
  }>('/bookmarks', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const { book_name, chapter, verse, translation, note } = request.body;

    if (!book_name || !chapter || !verse) {
      return reply.status(400).send({ error: 'book_name, chapter, and verse are required' });
    }

    const bookmark = await bookmarkService.createBookmark(
      request.userId!, book_name, chapter, verse, translation ?? 'KJV', note
    );
    return reply.status(201).send({ bookmark });
  });

  app.delete<{ Params: { id: string } }>('/bookmarks/:id', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const deleted = await bookmarkService.deleteBookmark(request.userId!, request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Bookmark not found' });
    }
    return { success: true };
  });
}
