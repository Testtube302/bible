import type { FastifyInstance } from 'fastify';
import * as questService from '../services/quest.service.js';

export async function questRoutes(app: FastifyInstance): Promise<void> {
  app.get('/quest/dashboard', async () => {
    return questService.getQuestDashboard();
  });

  app.get('/quest/achievements', async () => {
    return { achievements: await questService.getAllAchievements() };
  });

  app.get<{
    Params: { book: string; chapter: string };
  }>('/quest/questions/:book/:chapter', async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const questions = await questService.generateChapterQuestions(
      request.params.book, chapter
    );
    return { questions };
  });

  app.post<{
    Params: { book: string; chapter: string };
    Body: { question_index: number; answer: number };
  }>('/quest/questions/:book/:chapter/answer', async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const { question_index, answer } = request.body;
    const result = await questService.submitAnswer(
      request.params.book, chapter, question_index, answer
    );
    return result;
  });
}
