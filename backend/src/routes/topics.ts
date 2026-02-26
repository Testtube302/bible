import type { FastifyInstance } from 'fastify';
import * as topicService from '../services/topic.service.js';

export async function topicRoutes(app: FastifyInstance): Promise<void> {
  app.get('/topics', async () => {
    return { topics: topicService.getAllTopics() };
  });

  app.get<{ Params: { topic: string } }>('/topics/:topic', async (request, reply) => {
    const result = await topicService.getTopicSummary(request.params.topic);
    if (!result) {
      return reply.status(404).send({ error: 'Topic not found' });
    }
    return result;
  });
}
