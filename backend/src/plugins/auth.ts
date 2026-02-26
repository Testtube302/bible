import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cookie from '@fastify/cookie';
import { query } from '../db/postgres.js';
import { config } from '../config.js';

export async function registerAuth(app: FastifyInstance): Promise<void> {
  await app.register(cookie, {
    secret: config.ADMIN_SESSION_SECRET,
  });

  app.decorate('authenticateAdmin', async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
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
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticateAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
