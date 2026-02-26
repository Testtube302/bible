import type { FastifyInstance } from 'fastify';
import * as journeyService from '../services/journey.service.js';

export async function journeyRoutes(app: FastifyInstance): Promise<void> {
  app.get('/journeys', async () => {
    return { journeys: await journeyService.getAllJourneys() };
  });

  app.get<{ Params: { slug: string } }>('/journeys/:slug', async (request, reply) => {
    const journey = await journeyService.getJourney(request.params.slug);
    if (!journey) {
      return reply.status(404).send({ error: 'Journey not found' });
    }
    return { journey };
  });

  app.post<{ Params: { slug: string } }>('/journeys/:slug/generate', async (request, reply) => {
    const journey = await journeyService.getJourney(request.params.slug);
    if (!journey) {
      return reply.status(404).send({ error: 'Journey not found' });
    }
    await journeyService.generateJourneyContent(journey.id);
    // Re-fetch with generated content
    const updated = await journeyService.getJourney(request.params.slug);
    return { journey: updated };
  });

  app.put<{
    Params: { slug: string };
    Body: { current_passage: number };
  }>('/journeys/:slug/progress', async (request, reply) => {
    try {
      await journeyService.updateProgress(
        request.params.slug,
        request.body.current_passage
      );
      return { success: true };
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
