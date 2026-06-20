import OpenAI from 'openai';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';
import {
  AIProvider,
  GenerateTextOptions,
  GenerateStructuredOptions,
} from '../ai-provider.interface';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const DEFAULT_MODEL = 'gpt-4o';

export const openAIProvider: AIProvider = {
  async generateText({ messages, temperature = 0.7, maxTokens = 1000 }: GenerateTextOptions): Promise<string> {
    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new AppError('AI provider returned an empty response', 502);
    }

    return content;
  },

  async generateStructured<T>({
    messages,
    schemaDescription,
    validate,
    temperature = 0.3,
    maxTokens = 1500,
  }: GenerateStructuredOptions<T>): Promise<T> {
    const structuredMessages = [
      ...messages,
      {
        role: 'system' as const,
        content: `Respond with ONLY valid JSON, no markdown fences, no preamble, no explanation. Expected shape: ${schemaDescription}`,
      },
    ];

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: structuredMessages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new AppError('AI provider returned an empty response', 502);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new AppError('AI provider returned invalid JSON', 502);
    }

    try {
      return validate(parsed);
    } catch {
      throw new AppError('AI provider response failed schema validation', 502);
    }
  },
};