import type { FastifyInstance } from 'fastify';
import * as userService from '../services/user.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax' as const,
  path: '/bible',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export async function authRoutes(app: FastifyInstance): Promise<void> {
  // Register (public)
  app.post<{
    Body: { email: string; password: string; displayName: string };
  }>('/auth/register', async (request, reply) => {
    const { email, password, displayName } = request.body;

    if (!email || !password || !displayName) {
      return reply.status(400).send({ error: 'Email, password, and display name are required' });
    }

    if (password.length < 8) {
      return reply.status(400).send({ error: 'Password must be at least 8 characters' });
    }

    try {
      const { user, token } = await userService.register(email, password, displayName);
      reply.setCookie('user_session', token, COOKIE_OPTIONS);
      return { user };
    } catch (err: any) {
      if (err.code === '23505') {
        return reply.status(409).send({ error: 'Email already registered' });
      }
      throw err;
    }
  });

  // Login (public)
  app.post<{
    Body: { email: string; password: string };
  }>('/auth/login', async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const result = await userService.login(email, password);
    if (!result) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    reply.setCookie('user_session', result.token, COOKIE_OPTIONS);
    return { user: result.user };
  });

  // Logout (requires auth)
  app.post('/auth/logout', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const token = request.cookies.user_session;
    if (token) {
      await userService.logout(token);
    }
    reply.clearCookie('user_session', { path: '/bible' });
    return { success: true };
  });

  // Get current user profile (requires auth)
  app.get('/auth/me', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const user = await userService.getProfile(request.userId!);
    return { user };
  });

  // Change own password (requires auth)
  app.put<{
    Body: { currentPassword: string; newPassword: string };
  }>('/auth/me/password', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const { currentPassword, newPassword } = request.body;

    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return reply.status(400).send({ error: 'New password must be at least 8 characters' });
    }

    const success = await userService.changePassword(
      request.userId!,
      currentPassword,
      newPassword
    );

    if (!success) {
      return reply.status(400).send({ error: 'Current password is incorrect' });
    }

    return { success: true };
  });
}
