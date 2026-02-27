import type { FastifyInstance } from 'fastify';
import * as progressService from '../services/progress.service.js';

export async function progressRoutes(app: FastifyInstance): Promise<void> {
  app.get('/progress', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    return progressService.getOverallProgress(request.userId!);
  });

  app.get<{ Params: { book: string } }>('/progress/:book', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const progress = await progressService.getBookProgress(request.userId!, request.params.book);
    return { progress };
  });

  app.put<{
    Params: { book: string; chapter: string };
    Body: { completed?: boolean; last_verse_read?: number };
  }>('/progress/:book/:chapter', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const { completed = false, last_verse_read = 0 } = request.body ?? {};

    await progressService.updateChapterProgress(
      request.userId!, request.params.book, chapter, completed, last_verse_read
    );
    return { success: true };
  });

  app.get('/progress/streak', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    return progressService.getStreakData(request.userId!);
  });
}
