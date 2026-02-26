import OpenAI from 'openai';
import type { LLMProvider, LLMConfig } from './provider.js';
import type { ChatMessage, LLMStreamChunk } from '../types/chat.js';

export class KimiProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: LLMConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
    this.model = config.model;
    this.temperature = config.temperature;
    this.maxTokens = config.maxTokens;
  }

  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: false,
    });
    return response.choices[0]?.message?.content ?? '';
  }

  async *stream(messages: ChatMessage[]): AsyncIterable<LLMStreamChunk> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? '';
      const finishReason = chunk.choices[0]?.finish_reason;

      if (content) {
        yield { content, done: false };
      }
      if (finishReason) {
        yield { content: '', done: true };
      }
    }
  }
}
