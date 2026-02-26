import type { ChatMessage, LLMStreamChunk } from '../types/chat.js';

export interface LLMProvider {
  complete(messages: ChatMessage[]): Promise<string>;
  stream(messages: ChatMessage[]): AsyncIterable<LLMStreamChunk>;
}

export interface LLMConfig {
  provider: 'kimi' | 'anthropic';
  baseUrl: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}
