import type { FastifyInstance } from 'fastify';
import * as searchService from '../services/search.service.js';
import type { Translation } from '../types/bible.js';

export async function searchRoutes(app: FastifyInstance): Promise<void> {
  app.get<{
    Querystring: {
      q: string;
      type?: string;
      translation?: string;
      testament?: string;
      limit?: string;
    };
  }>('/search', {
    config: {
      rateLimit: {
        max: 30,
        timeWindow: '1 minute',
      },
    },
  }, async (request, reply) => {
    const { q, type, translation, testament, limit } = request.query;

    if (!q || q.trim().length === 0) {
      return reply.status(400).send({ error: 'Query parameter "q" is required' });
    }

    const translationVal = (translation?.toUpperCase() ?? 'KJV') as Translation;
    const limitVal = Math.min(parseInt(limit ?? '20', 10), 100);

    const results = await searchService.semanticSearch(
      q.trim(),
      translationVal,
      testament,
      limitVal
    );

    return { query: q, results };
  });
}
