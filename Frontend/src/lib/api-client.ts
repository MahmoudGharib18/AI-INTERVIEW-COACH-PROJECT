import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
	timeout: 15000,
	withCredentials: true, // required for the httpOnly auth cookie
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => response, // keep the full Axios response — callers read response.data.data
	(error) => {
		const fallbackMessage = error.response?.data?.message || "Network error — please try again.";
		return Promise.reject(new Error(fallbackMessage));
	},
);
