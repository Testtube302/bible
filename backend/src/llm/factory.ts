import { config } from '../config.js';
import type { LLMProvider, LLMConfig } from './provider.js';
import { KimiProvider } from './kimi.provider.js';
import { AnthropicProvider } from './anthropic.provider.js';

let instance: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (!instance) {
    const llmConfig: LLMConfig = {
      provider: config.LLM_PROVIDER,
      baseUrl: config.LLM_BASE_URL,
      model: config.LLM_MODEL,
      apiKey: config.LLM_API_KEY,
      temperature: config.LLM_TEMPERATURE,
      maxTokens: config.LLM_MAX_TOKENS,
    };

    switch (config.LLM_PROVIDER) {
      case 'kimi':
        instance = new KimiProvider(llmConfig);
        break;
      case 'anthropic':
        instance = new AnthropicProvider(llmConfig);
        break;
      default:
        throw new Error(`Unknown LLM provider: ${config.LLM_PROVIDER}`);
    }
  }
  return instance;
}
