import { api } from "@/lib/api-client.ts";
import type { ApiResponse, User } from "@/types/index.ts";


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  preferredInterviewTime?: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<{ user: User }>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<{ user: User }>>('/auth/register', payload),

  logout: () => api.post<ApiResponse<null>>('/auth/logout'),

  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),
};