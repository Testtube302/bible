import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cookie from '@fastify/cookie';
import { query } from '../db/postgres.js';
import { config } from '../config.js';
import { validateSession } from '../services/user.service.js';

export async function registerAuth(app: FastifyInstance): Promise<void> {
  await app.register(cookie, {
    secret: config.ADMIN_SESSION_SECRET,
  });

  // Legacy admin session auth (env-var credentials)
  app.decorate('authenticateAdmin', async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // First try user_session cookie (for admin-role users)
    const userToken = request.cookies.user_session;
    if (userToken) {
      const session = await validateSession(userToken);
      if (session && session.role === 'admin') {
        request.userId = session.userId;
        request.userRole = session.role;
        return;
      }
    }

    // Fall back to legacy admin_session cookie
    const token = request.cookies.admin_session;
    if (!token) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const result = await query(
      'SELECT id FROM admin_sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return reply.status(401).send({ error: 'Session expired or invalid' });
    }
  });

  // User authentication (requires valid user_session)
  app.decorate('authenticateUser', async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const token = request.cookies.user_session;
    if (!token) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const session = await validateSession(token);
    if (!session) {
      return reply.status(401).send({ error: 'Session expired or invalid' });
    }

    request.userId = session.userId;
    request.userRole = session.role;
  });

  // Optional auth (sets userId if logged in, null otherwise)
  app.decorate('optionalAuth', async function (
    request: FastifyRequest,
    _reply: FastifyReply
  ) {
    request.userId = null;
    request.userRole = null;

    const token = request.cookies.user_session;
    if (token) {
      const session = await validateSession(token);
      if (session) {
        request.userId = session.userId;
        request.userRole = session.role;
      }
    }
  });

  // Decorate request with default null values
  app.decorateRequest('userId', null);
  app.decorateRequest('userRole', null);
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticateAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authenticateUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userId: string | null;
    userRole: string | null;
  }
}
