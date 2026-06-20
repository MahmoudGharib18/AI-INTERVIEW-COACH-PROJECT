import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api-client';

export const useAuthActions = () => {
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const executeLogin = async (payload: Record<string, string>) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      // Maps precisely to POST /api/auth/login matching API_REFERENCE.md
      const response: any = await api.post('/auth/login', {
        email: payload.email,
        password: payload.password
      });

      if (response && response.data?.user) {
        const userRecord = response.data.user;
        window.localStorage.setItem('orchestrator_user_meta', JSON.stringify(userRecord));
        setUser(userRecord);
        return { success: true };
      }
      throw new Error('Authentication schema mismatch.');
    } catch (err: any) {
      const msg = err.message || 'UNAUTHORIZED: Credential validation failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeRegister = async (payload: Record<string, string>) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      // Maps precisely to POST /api/auth/register matching API_REFERENCE.md
      const response: any = await api.post('/auth/register', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        preferredInterviewTime: payload.preferredInterviewTime || '09:00'
      });

      if (response && response.data?.user) {
        const userRecord = response.data.user;
        window.localStorage.setItem('orchestrator_user_meta', JSON.stringify(userRecord));
        setUser(userRecord);
        return { success: true };
      }
      throw new Error('Registration schema mismatch.');
    } catch (err: any) {
      const msg = err.message || 'CONFLICT: Account registration rejected.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeLogout = async () => {
    setIsSubmitting(true);
    try {
      // Maps precisely to POST /api/auth/logout matching API_REFERENCE.md
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Session termination cleared locally.');
    } finally {
      window.localStorage.removeItem('orchestrator_user_meta');
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
    clearError: () => setAuthError(null)
  };
};