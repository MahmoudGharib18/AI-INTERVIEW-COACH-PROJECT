// import { AIProvider, GenerateStructuredOptions, GenerateTextOptions } from "#/ai/ai-provider.interface.js";
// import { env } from "#/config/env.js";
// import { AppError } from "#/shared/errors/AppError.js";
// import { OpenAI } from "openai";

// const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// const DEFAULT_MODEL = 'gpt-4o';

// export const openAIProvider: AIProvider = {
//   async generateText({ messages, temperature = 0.7, maxTokens = 1000 }: GenerateTextOptions): Promise<string> {
//     const response = await client.chat.completions.create({
//       model: DEFAULT_MODEL,
//       messages,
//       temperature,
//       max_tokens: maxTokens,
//     });

//     const content = response.choices[0]?.message?.content;

//     if (!content) {
//       throw new AppError('AI provider returned an empty response', 502);
//     }

//     return content;
//   },

//   async generateStructured<T>({
//     messages,
//     schemaDescription,
//     validate,
//     temperature = 0.3,
//     maxTokens = 1500,
//   }: GenerateStructuredOptions<T>): Promise<T> {
//     const structuredMessages = [
//       ...messages,
//       {
//         role: 'system' as const,
//         content: `Respond with ONLY valid JSON, no markdown fences, no preamble, no explanation. Expected shape: ${schemaDescription}`,
//       },
//     ];

//     const response = await client.chat.completions.create({
//       model: DEFAULT_MODEL,
//       messages: structuredMessages,
//       temperature,
//       max_tokens: maxTokens,
//       response_format: { type: 'json_object' },
//     });

//     const raw = response.choices[0]?.message?.content;

//     if (!raw) {
//       throw new AppError('AI provider returned an empty response', 502);
//     }

//     let parsed: unknown;
//     try {
//       parsed = JSON.parse(raw);
//     } catch {
//       throw new AppError('AI provider returned invalid JSON', 502);
//     }

//     try {
//       return validate(parsed);
//     } catch {
//       throw new AppError('AI provider response failed schema validation', 502);
//     }
//   },
// };

import { AIProvider, GenerateStructuredOptions, GenerateTextOptions, AIMessage } from "#/ai/ai-provider.interface.js";
import { env } from "#/config/env.js";
import { AppError } from "#/shared/errors/AppError.js";
import { GoogleGenAI, Content } from "@google/genai";

// Standard production-stable Gemini model
const DEFAULT_MODEL = "gemini-3.1-flash-lite";

// Initialize client. It defaults to the process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });

/**
 * Maps the internal standard AIMessage structure down to Gemini's native Content schema.
 * Gemini uses 'model' instead of 'assistant'.
 */
function mapMessagesToGemini(messages: AIMessage[]): Content[] {
	return messages.map((msg) => ({
		role: msg.role === "assistant" ? "model" : msg.role,
		parts: [{ text: msg.content }],
	}));
}

export const geminiProvider: AIProvider = {
	async generateText({ messages, temperature = 0.7, maxTokens = 1000 }: GenerateTextOptions): Promise<string> {
		try {
			const contents = mapMessagesToGemini(messages);

			const response = await ai.models.generateContent({
				model: DEFAULT_MODEL,
				contents,
				config: {
					temperature,
					maxOutputTokens: maxTokens,
				},
			});

			const content = response.text;

			if (!content) {
				throw new AppError("AI provider returned an empty response", 502);
			}

			return content;
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(`Gemini Execution Failed: ${(error as Error).message}`, 502);
		}
	},

	async generateStructured<T>({ messages, schemaDescription, validate, temperature = 0.3, maxTokens = 1500 }: GenerateStructuredOptions<T>): Promise<T> {
		try {
			const contents = mapMessagesToGemini(messages);

			const response = await ai.models.generateContent({
				model: DEFAULT_MODEL,
				contents,
				config: {
					temperature,
					maxOutputTokens: maxTokens,
					// Enforces JSON mode natively on the Gemini architecture
					responseMimeType: "application/json",
					systemInstruction: `Respond with ONLY a valid JSON object matching the requested schema. No markdown fences, no formatting prose. Schema definition: ${schemaDescription}`,
				},
			});

			const raw = response.text;

			if (!raw) {
				throw new AppError("AI provider returned an empty response", 502);
			}

			let parsed: unknown;
			try {
				parsed = JSON.parse(raw);
			} catch {
				throw new AppError("AI provider returned invalid JSON strings", 502);
			}

			try {
				return validate(parsed);
			} catch {
				throw new AppError("AI provider response failed runtime schema validation", 502);
			}
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError(`Gemini Structured Generation Failed: ${(error as Error).message}`, 502);
		}
	},
};
