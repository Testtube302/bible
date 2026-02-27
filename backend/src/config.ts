import { z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  // Server
  BACKEND_HOST: z.string().default('0.0.0.0'),
  BACKEND_PORT: z.coerce.number().default(3002),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // PostgreSQL
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default('bible'),
  POSTGRES_USER: z.string().default('bible_user'),
  POSTGRES_PASSWORD: z.string(),

  // ChromaDB
  CHROMADB_HOST: z.string().default('localhost'),
  CHROMADB_PORT: z.coerce.number().default(8000),

  // LLM
  LLM_PROVIDER: z.enum(['kimi', 'anthropic']).default('kimi'),
  LLM_BASE_URL: z.string().default('https://api.moonshot.ai/v1'),
  LLM_MODEL: z.string().default('kimi-k2.5'),
  LLM_API_KEY: z.string(),
  LLM_TEMPERATURE: z.coerce.number().default(0.6),
  LLM_MAX_TOKENS: z.coerce.number().default(2048),

  // Admin
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string(),
  ADMIN_SESSION_SECRET: z.string(),
  ADMIN_EMAIL: z.string().default('admin@scripture.app'),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
