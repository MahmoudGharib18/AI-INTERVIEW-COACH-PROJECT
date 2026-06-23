import { api } from "../../../lib/api-client";
import type { ApiResponse, Interview } from "../../../types";

export const dsaService = {
	getById: (interviewId: string) => api.get<ApiResponse<{ interview: Interview }>>(`/dsa-interview/${interviewId}`),

	submit: (interviewId: string, payload: { questionIndex: number; problemId: string; code: string; language: string }) => api.post<ApiResponse<{ interview: Interview }>>(`/dsa-interview/${interviewId}/submit`, payload),

	complete: (interviewId: string) => api.post<ApiResponse<{ interview: Interview }>>(`/dsa-interview/${interviewId}/complete`),

	clarify: (interviewId: string, payload: { questionIndex: number; problemId: string; candidateQuestion: string }) => api.post<ApiResponse<{ response: string; wasFlagged: boolean }>>(`/dsa-interview/${interviewId}/clarify`, payload),
};
