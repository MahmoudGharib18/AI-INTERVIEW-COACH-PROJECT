import { env } from '@/config/env';
import { AIProvider } from './ai-provider.interface';
import { openAIProvider } from './providers/openai.provider';

const providers: Record<string, AIProvider> = {
  openai: openAIProvider,
};

export const getAIProvider = (): AIProvider => {
  const provider = providers[env.AI_PROVIDER];

  if (!provider) {
    throw new Error(`Unknown AI provider configured: ${env.AI_PROVIDER}`);
  }

  return provider;
};