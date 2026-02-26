import type { FastifyInstance } from 'fastify';
import * as adminService from '../services/admin.service.js';
import * as chatService from '../services/chat.service.js';

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  // Login (no auth required)
  app.post<{
    Body: { username: string; password: string };
  }>('/admin/login', async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.status(400).send({ error: 'Username and password are required' });
    }

    const token = await adminService.login(username, password);
    if (!token) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    reply.setCookie('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return { success: true };
  });

  // All routes below require authentication
  app.post('/admin/logout', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const token = request.cookies.admin_session;
    if (token) {
      await adminService.logout(token);
    }
    reply.clearCookie('admin_session', { path: '/' });
    return { success: true };
  });

  app.get('/admin/analytics/summary', {
    preHandler: [app.authenticateAdmin],
  }, async () => {
    return adminService.getAnalyticsSummary();
  });

  app.get('/admin/analytics/searches', {
    preHandler: [app.authenticateAdmin],
  }, async () => {
    const searches = await adminService.getTopSearches();
    return { searches };
  });

  app.get('/admin/analytics/popular-books', {
    preHandler: [app.authenticateAdmin],
  }, async () => {
    const books = await adminService.getPopularBooks();
    return { books };
  });

  app.get('/admin/chat-history', {
    preHandler: [app.authenticateAdmin],
  }, async () => {
    const sessions = await chatService.getAllSessions();
    return { sessions };
  });

  app.delete<{ Params: { sessionId: string } }>('/admin/chat-history/:sessionId', {
    preHandler: [app.authenticateAdmin],
  }, async (request) => {
    await chatService.deleteSession(request.params.sessionId);
    return { success: true };
  });
}
