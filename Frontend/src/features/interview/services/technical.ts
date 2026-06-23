import { api } from "../../../lib/api-client";
import type { ApiResponse, Interview, EvaluationResult } from "../../../types";

export const technicalService = {
	getById: (interviewId: string) => api.get<ApiResponse<{ interview: Interview }>>(`/technical-interview/${interviewId}`),

	submit: (interviewId: string, answer: string) => api.post<ApiResponse<{ interview: Interview; evaluation: EvaluationResult }>>(`/technical-interview/${interviewId}/submit`, { answer }),

	next: (interviewId: string) => api.post<ApiResponse<{ interview: Interview; question: string | null; timeExpired: boolean }>>(`/technical-interview/${interviewId}/next`),

	complete: (interviewId: string) => api.post<ApiResponse<{ interview: Interview }>>(`/technical-interview/${interviewId}/complete`),
};
