import type { FastifyInstance } from 'fastify';
import { checkConnection as checkPostgres } from '../db/postgres.js';
import { checkChromaConnection } from '../db/chromadb.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const [postgres, chromadb] = await Promise.all([
      checkPostgres(),
      checkChromaConnection(),
    ]);

    const healthy = postgres && chromadb;

    return {
      status: healthy ? 'healthy' : 'degraded',
      services: {
        postgres: postgres ? 'connected' : 'disconnected',
        chromadb: chromadb ? 'connected' : 'disconnected',
      },
      timestamp: new Date().toISOString(),
    };
  });
}
