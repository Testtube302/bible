import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import type { Collection } from 'chromadb';
import { config } from '../config.js';

let client: ChromaClient | null = null;
const embeddingFunction = new DefaultEmbeddingFunction();

export function getChromaClient(): ChromaClient {
  if (!client) {
    client = new ChromaClient({
      path: `http://${config.CHROMADB_HOST}:${config.CHROMADB_PORT}`,
    });
  }
  return client;
}

export async function getCollection(name: string): Promise<Collection> {
  const c = getChromaClient();
  return (c as any).getCollection({ name, embeddingFunction });
}

export async function checkChromaConnection(): Promise<boolean> {
  try {
    const c = getChromaClient();
    await c.heartbeat();
    return true;
  } catch {
    return false;
  }
}
