import type { FastifyInstance } from 'fastify';
import * as journeyService from '../services/journey.service.js';

export async function journeyRoutes(app: FastifyInstance): Promise<void> {
  // Public browse with optional user progress
  app.get('/journeys', {
    preHandler: [app.optionalAuth],
  }, async (request) => {
    return { journeys: await journeyService.getAllJourneys(request.userId) };
  });

  app.get<{ Params: { slug: string } }>('/journeys/:slug', {
    preHandler: [app.optionalAuth],
  }, async (request, reply) => {
    const journey = await journeyService.getJourney(request.params.slug, request.userId);
    if (!journey) {
      return reply.status(404).send({ error: 'Journey not found' });
    }
    return { journey };
  });

  // Generate content requires auth
  app.post<{ Params: { slug: string } }>('/journeys/:slug/generate', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const journey = await journeyService.getJourney(request.params.slug, request.userId);
    if (!journey) {
      return reply.status(404).send({ error: 'Journey not found' });
    }
    await journeyService.generateJourneyContent(journey.id, request.userId!);
    // Re-fetch with generated content
    const updated = await journeyService.getJourney(request.params.slug, request.userId);
    return { journey: updated };
  });

  // Update progress requires auth
  app.put<{
    Params: { slug: string };
    Body: { current_passage: number };
  }>('/journeys/:slug/progress', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    try {
      await journeyService.updateProgress(
        request.userId!,
        request.params.slug,
        request.body.current_passage
      );
      return { success: true };
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
