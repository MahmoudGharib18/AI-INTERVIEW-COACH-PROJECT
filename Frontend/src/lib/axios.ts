import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
	withCredentials: true, // Crucial: forces browser to pass the httpOnly token cookie
	headers: {
		"Content-Type": "application/json",
	},
});

// Clean Interceptor for Operational Error Telemetry
api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const fallbackMessage = "An unexpected transmission error occurred.";
		const customError = {
			message: error.response?.data?.message || fallbackMessage,
			status: error.response?.status || 500,
		};

		// Global toast trigger can hook into this pipeline
		return Promise.reject(customError);
	},
);
