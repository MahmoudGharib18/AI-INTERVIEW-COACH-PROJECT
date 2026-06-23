// import { AIProvider } from "#/ai/ai-provider.interface.js";
// import { openAIProvider } from "#/ai/providers/openai.provider.js";
// import { env } from "#/config/env.js";

// const providers: Record<string, AIProvider> = {
//   openai: openAIProvider,
// };

// export const getAIProvider = (): AIProvider => {
//   const provider = providers[env.AI_PROVIDER];

//   if (!provider) {
//     throw new Error(`Unknown AI provider configured: ${env.AI_PROVIDER}`);
//   }

//   return provider;
// };
import { AIProvider } from "#/ai/ai-provider.interface.js";
import { geminiProvider } from "#/ai/providers/gemini.provider.js";
import { env } from "#/config/env.js";

const providers: Record<string, AIProvider> = {
  gemini: geminiProvider,
};

export const getAIProvider = (): AIProvider => {
  const provider = providers[env.AI_PROVIDER];

  if (!provider) {
    throw new Error(`Unknown AI provider configured: ${env.AI_PROVIDER}`);
  }

  return provider;
};