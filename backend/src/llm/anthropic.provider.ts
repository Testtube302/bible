import type { LLMProvider, LLMConfig } from './provider.js';
import type { ChatMessage, LLMStreamChunk } from '../types/chat.js';

export class AnthropicProvider implements LLMProvider {
  constructor(_config: LLMConfig) {
    // Will be implemented when Anthropic SDK is integrated
  }

  async complete(_messages: ChatMessage[]): Promise<string> {
    throw new Error(
      'Anthropic provider not yet implemented. Set LLM_PROVIDER=kimi in your .env file.'
    );
  }

  async *stream(_messages: ChatMessage[]): AsyncIterable<LLMStreamChunk> {
    throw new Error(
      'Anthropic provider not yet implemented. Set LLM_PROVIDER=kimi in your .env file.'
    );
  }
}
