import Fastify from 'fastify';
import { config } from './config.js';
import { registerCors } from './plugins/cors.js';
import { registerWebSocket } from './plugins/websocket.js';
import { registerRateLimit } from './plugins/rate-limit.js';
import { registerAuth } from './plugins/auth.js';
import { healthRoutes } from './routes/health.js';
import { bibleRoutes } from './routes/bible.js';
import { searchRoutes } from './routes/search.js';
import { bookmarkRoutes } from './routes/bookmarks.js';
import { highlightRoutes } from './routes/highlights.js';
import { progressRoutes } from './routes/progress.js';
import { adminRoutes } from './routes/admin.js';
import { chatRoutes } from './routes/chat.js';

async function build() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    trustProxy: true,
  });

  // Register plugins (order matters)
  await registerCors(app);
  await registerRateLimit(app);
  await registerWebSocket(app);
  await registerAuth(app);

  // Register routes
  await app.register(healthRoutes, { prefix: '/api' });
  await app.register(bibleRoutes, { prefix: '/api' });
  await app.register(searchRoutes, { prefix: '/api' });
  await app.register(bookmarkRoutes, { prefix: '/api' });
  await app.register(highlightRoutes, { prefix: '/api' });
  await app.register(progressRoutes, { prefix: '/api' });
  await app.register(adminRoutes, { prefix: '/api' });
  await app.register(chatRoutes, { prefix: '/api' });

  return app;
}

build().then(async (app) => {
  try {
    await app.listen({ host: config.BACKEND_HOST, port: config.BACKEND_PORT });
    console.log(`\n📖 Scripture Bible API running on http://${config.BACKEND_HOST}:${config.BACKEND_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
});
