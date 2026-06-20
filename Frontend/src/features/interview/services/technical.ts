import { api } from '../../../lib/api-client';

export const technicalService = {
  startSession: () => api.post('/technical-interview/start'),
  submitClarification: (promptText: string) => api.post('/technical-interview/clarify', { question: promptText }),
  submitAnswer: (markdownText: string) => api.post('/technical-interview/submit', { answer: markdownText })
};