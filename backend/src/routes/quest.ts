import type { FastifyInstance } from 'fastify';
import * as questService from '../services/quest.service.js';

export async function questRoutes(app: FastifyInstance): Promise<void> {
  app.get('/quest/dashboard', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    return questService.getQuestDashboard(request.userId!);
  });

  app.get('/quest/achievements', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    return { achievements: await questService.getAllAchievements(request.userId!) };
  });

  app.get<{
    Params: { book: string; chapter: string };
  }>('/quest/questions/:book/:chapter', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const questions = await questService.generateChapterQuestions(
      request.params.book, chapter
    );
    return { questions };
  });

  app.post<{
    Params: { book: string; chapter: string };
    Body: { question_index: number; answer: number };
  }>('/quest/questions/:book/:chapter/answer', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const chapter = parseInt(request.params.chapter, 10);
    const { question_index, answer } = request.body;
    const result = await questService.submitAnswer(
      request.userId!, request.params.book, chapter, question_index, answer
    );
    return result;
  });
}
