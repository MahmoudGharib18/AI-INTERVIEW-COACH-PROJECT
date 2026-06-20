import { api } from '../../../lib/api-client';

export const dsaService = {
  startSession: () => api.post('/dsa-interview/start'),
  submitClarification: (promptText: string) => api.post('/dsa-interview/clarify', { question: promptText }),
  submitSolution: (sourceCode: string, lang: string) => api.post('/dsa-interview/submit', { code: sourceCode, language: lang }),
  getActiveChallenge: () => api.get('/sessions/active') // Fallback hydration validation path matching API_REFERENCE.md
};