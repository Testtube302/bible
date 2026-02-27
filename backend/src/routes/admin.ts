import type { FastifyInstance } from 'fastify';
import * as adminService from '../services/admin.service.js';
import * as chatService from '../services/chat.service.js';
import * as userService from '../services/user.service.js';

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
      secure: process.env.COOKIE_SECURE === 'true',
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

  // --- User CRUD (admin only) ---

  app.get('/admin/users', {
    preHandler: [app.authenticateAdmin],
  }, async () => {
    const users = await userService.listUsers();
    return { users };
  });

  app.post<{
    Body: { email: string; password: string; displayName: string; role?: string };
  }>('/admin/users', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const { email, password, displayName, role } = request.body;

    if (!email || !password || !displayName) {
      return reply.status(400).send({ error: 'Email, password, and display name are required' });
    }

    try {
      const user = await userService.createUser(email, password, displayName, role ?? 'user');
      return reply.status(201).send({ user });
    } catch (err: any) {
      if (err.code === '23505') {
        return reply.status(409).send({ error: 'Email already exists' });
      }
      throw err;
    }
  });

  app.get<{ Params: { id: string } }>('/admin/users/:id', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const user = await userService.getProfile(request.params.id);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return { user };
  });

  app.put<{
    Params: { id: string };
    Body: { email?: string; displayName?: string; role?: string };
  }>('/admin/users/:id', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const user = await userService.updateUser(request.params.id, request.body);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return { user };
  });

  app.delete<{ Params: { id: string } }>('/admin/users/:id', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const deleted = await userService.deleteUser(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return { success: true };
  });

  app.put<{
    Params: { id: string };
    Body: { password: string };
  }>('/admin/users/:id/password', {
    preHandler: [app.authenticateAdmin],
  }, async (request, reply) => {
    const { password } = request.body;

    if (!password || password.length < 8) {
      return reply.status(400).send({ error: 'Password must be at least 8 characters' });
    }

    const success = await userService.resetPassword(request.params.id, password);
    if (!success) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return { success: true };
  });
}
