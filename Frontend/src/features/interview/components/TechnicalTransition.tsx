import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api-client.ts';
import { Button } from '../../../components/ui/Button.tsx';

export const TechnicalTransition: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionMetadata = location.state?.sessionMetadata;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const advancePipeline = async () => {
      if (!sessionMetadata?.sessionId) {
        setError('CRITICAL ERROR: Matrix reference key invalid.');
        setLoading(false);
        return;
      }

      try {
        // Trigger your backend advance state middleware contract
        const response: any = await api.post(`/daily-session/${sessionMetadata.sessionId}/advance-to-technical`);
        
        // Pass response straight to Technical Interview stage
        navigate('/arena/technical', { state: { technicalData: response.data } });
      } catch (err: any) {
        setError(err.message || 'State validation mismatch.');
      } finally {
        setLoading(false);
      }
    };

    advancePipeline();
  }, [sessionMetadata, navigate]);

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 scanlines font-mono">
      <div className="w-full max-w-md bg-cyber-surface border-2 border-cyber-border p-6 text-center shadow-brutal">
        <h2 className="text-white font-black tracking-widest text-sm mb-4">PHASE_01 // DESERIALIZED_SUCCESSFUL</h2>
        
        {loading && (
          <div className="space-y-3">
            <div className="text-xs text-cyber-neonGreen animate-pulse">RECOMPILING PERFORMANCE PROFILES...</div>
            <div className="w-full bg-cyber-bg h-2 border border-cyber-border relative overflow-hidden">
              <div className="bg-cyber-neonGreen h-full w-1/2 absolute animate-infinite-slide" />
            </div>
          </div>
        )}

        {error && (
          <div>
            <div className="text-xs text-cyber-neonRed uppercase mb-4">⚠️ PIPELINE_FAULT: {error}</div>
            <Button variant="muted" onClick={() => navigate('/dashboard')}>ABORT TO HUB</Button>
          </div>
        )}
      </div>
    </div>
  );
};