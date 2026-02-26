import type { FastifyInstance } from 'fastify';
import * as progressService from '../services/progress.service.js';

export async function progressRoutes(app: FastifyInstance): Promise<void> {
  app.get('/progress', async () => {
    return progressService.getOverallProgress();
  });

  app.get<{ Params: { book: string } }>('/progress/:book', async (request) => {
    const progress = await progressService.getBookProgress(request.params.book);
    return { progress };
  });

  app.put<{
    Params: { book: string; chapter: string };
    Body: { completed?: boolean; last_verse_read?: number };
  }>('/progress/:book/:chapter', async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const { completed = false, last_verse_read = 0 } = request.body ?? {};

    await progressService.updateChapterProgress(
      request.params.book, chapter, completed, last_verse_read
    );
    return { success: true };
  });

  app.get('/progress/streak', async () => {
    return progressService.getStreakData();
  });
}
