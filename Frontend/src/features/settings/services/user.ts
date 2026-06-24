import { api } from "@/lib/api-client.ts";
import type { ApiResponse, User } from "@/types/index.ts";


export interface UpdateProfilePayload {
  name?: string;
  preferredInterviewTime?: string;
}

export const userService = {
  getProfile: () => api.get<ApiResponse<{ user: User }>>('/user/me'),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.patch<ApiResponse<{ user: User }>>('/user/me', payload),
};