import { api } from '../../../lib/api-client';
import type { ApiResponse, Session } from '../../../types';

export const sessionService = {
  getActive: () =>
    api.get<ApiResponse<{ session: Session | null }>>('/sessions/active'),

  getHistory: () =>
    api.get<ApiResponse<{ sessions: Session[] }>>('/sessions/history'),

  getById: (sessionId: string) =>
    api.get<ApiResponse<{ session: Session }>>(`/sessions/${sessionId}`),

  begin: (sessionId: string) =>
    api.post<ApiResponse<{ session: Session; dsaInterviewId: string; problems: import('../../../types').Problem[] }>>(
      `/daily-session/${sessionId}/begin`
    ),

  advanceToTechnical: (sessionId: string) =>
    api.post<ApiResponse<{ session: Session; technicalInterviewId: string; firstQuestion: string }>>(
      `/daily-session/${sessionId}/advance-to-technical`
    ),

  finish: (sessionId: string) =>
    api.post<ApiResponse<{ session: Session }>>(`/daily-session/${sessionId}/finish`),
};