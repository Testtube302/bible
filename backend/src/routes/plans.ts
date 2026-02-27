import type { FastifyInstance } from 'fastify';
import * as planService from '../services/plan.service.js';

export async function planRoutes(app: FastifyInstance): Promise<void> {
  // Categories are public
  app.get('/plans/categories', async () => {
    return { categories: await planService.getAllCategories() };
  });

  // Plans list with optional user progress
  app.get<{ Querystring: { category?: string } }>('/plans', {
    preHandler: [app.optionalAuth],
  }, async (request) => {
    const category = request.query.category;
    return { plans: await planService.getAllPlans(category, request.userId) };
  });

  app.get<{ Params: { slug: string } }>('/plans/:slug', {
    preHandler: [app.optionalAuth],
  }, async (request, reply) => {
    const plan = await planService.getPlan(request.params.slug, request.userId);
    if (!plan) {
      return reply.status(404).send({ error: 'Plan not found' });
    }
    return { plan };
  });

  // Generate content requires auth
  app.post<{ Params: { slug: string } }>('/plans/:slug/generate', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const plan = await planService.getPlan(request.params.slug, request.userId);
    if (!plan) {
      return reply.status(404).send({ error: 'Plan not found' });
    }
    await planService.generatePlanContent(plan.id, request.userId!);
    const updated = await planService.getPlan(request.params.slug, request.userId);
    return { plan: updated };
  });

  // Update progress requires auth
  app.put<{
    Params: { slug: string };
    Body: { day: number; completed: boolean };
  }>('/plans/:slug/progress', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    try {
      await planService.updateProgress(
        request.userId!,
        request.params.slug,
        request.body.day,
        request.body.completed
      );
      return { success: true };
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
