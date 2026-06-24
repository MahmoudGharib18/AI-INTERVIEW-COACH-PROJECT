import { useAuth } from "@/context/AuthContext.tsx";
import { useTour } from "@/context/TourContext.tsx";
import { authService } from "@/features/auth/services/auth.ts";
import type { User } from "@/types/index.ts";
import { useState } from "react";

export const useAuthActions = () => {
	const { setUser } = useAuth();
	const { startTour } = useTour();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const executeLogin = async (payload: { email: string; password: string }) => {
		setIsSubmitting(true);
		setAuthError(null);
		try {
			const response = await authService.login(payload);
			const userRecord: User = response.data.data.user;
			setUser(userRecord);
			return { success: true };
		} catch (err: any) {
			const msg = err.message || "Invalid email or password.";
			setAuthError(msg);
			return { success: false, error: msg };
		} finally {
			setIsSubmitting(false);
		}
	};

	const executeRegister = async (payload: { name: string; email: string; password: string; preferredInterviewTime?: string }) => {
		setIsSubmitting(true);
		setAuthError(null);
		try {
			const response = await authService.register(payload);
			const userRecord: User = response.data.data.user;
			setUser(userRecord);
			setTimeout(() => startTour(), 300);
			return { success: true };
		} catch (err: any) {
			const msg = err.message || "Registration failed.";
			setAuthError(msg);
			return { success: false, error: msg };
		} finally {
			setIsSubmitting(false);
		}
	};

	const executeLogout = async () => {
		setIsSubmitting(true);
		try {
			await authService.logout();
		} catch {
			// logout failing server-side shouldn't block clearing local state
		} finally {
			setUser(null);
			setIsSubmitting(false);
		}
	};

	return {
		executeLogin,
		executeRegister,
		executeLogout,
		isSubmitting,
		authError,
		clearError: () => setAuthError(null),
	};
};
