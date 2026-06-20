export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateTextOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateStructuredOptions<T> extends GenerateTextOptions {
  schemaDescription: string; // plain-language description of expected JSON shape
  validate: (raw: unknown) => T; // caller-supplied validator (zod .parse, typically)
}

export interface AIProvider {
  generateText(options: GenerateTextOptions): Promise<string>;
  generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T>;
}