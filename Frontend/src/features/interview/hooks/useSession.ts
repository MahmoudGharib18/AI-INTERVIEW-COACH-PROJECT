import { useState, useCallback } from 'react';
import { api } from '../../../lib/api-client';

export const useSession = (sessionType: 'dsa' | 'technical') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const endpointBase = sessionType === 'dsa' ? '/dsa-interview' : '/technical-interview';

  const initializeSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await api.post(`${endpointBase}/start`);
      return response?.data;
    } catch (err: any) {
      const msg = err.message || 'ARENA_PROVISIONING_FAULT';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [endpointBase]);

  const transmitClarification = useCallback(async (question: string) => {
    try {
      const response: any = await api.post(`${endpointBase}/clarify`, { question });
      return response?.data;
    } catch (err: any) {
      throw new Error(err.message || 'TRANSMISSION_DECOUPLING_ERROR');
    }
  }, [endpointBase]);

  const compileFinalReport = useCallback(async (payload: { code?: string; answer?: string; language?: string }) => {
    setLoading(true);
    try {
      const response: any = await api.post(`${endpointBase}/submit`, payload);
      return response?.data;
    } catch (err: any) {
      setError(err.message || 'REPORT_FINALIZATION_FAULT');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpointBase]);

  return {
    initializeSession,
    transmitClarification,
    compileFinalReport,
    loading,
    error,
    clearSessionError: () => setError(null)
  };
};