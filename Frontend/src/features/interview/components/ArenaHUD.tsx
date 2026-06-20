import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { useInterval } from '../../../hooks/useInterval';

interface SessionData {
  id: string;
  status: 'PENDING' | 'EMAIL_SENT' | 'STARTED' | 'DSA_IN_PROGRESS' | 'TECHNICAL_IN_PROGRESS' | 'COMPLETED';
  scheduledTime: string; // ISO string from backend
  isLate: boolean;
}

export const ArenaHUD: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeftStr, setTimeLeftStr] = useState('03:00:00');
  const [systemLogs, setSystemLogs] = useState<string[]>(['INITIALIZING ARENA CORE...', 'CONNECTING TELEMETRY LINK...']);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchActiveSession = async () => {
    try {
      const response: any = await api.get('/sessions/active');
      if (response.data && response.data.session) {
        setSession(response.data.session);
        addLog(`SESSION LINK ESTABLISHED: STATUS // ${response.data.session.status}`);
      } else {
        setSession(null);
        addLog('NO ACTIVE DAILY SESSIONS FOUND FOR CURRENT CYCLE.');
      }
    } catch (err: any) {
      addLog(`CRITICAL ERROR: FETCH FAILED // ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSession();
  }, []);

  // Update countdown clock every second if session is waiting for activation
  useInterval(() => {
    if (!session || (session.status !== 'PENDING' && session.status !== 'EMAIL_SENT')) return;

    const scheduled = new Date(session.scheduledTime).getTime();
    const threeHoursLimit = scheduled + 3 * 60 * 60 * 1000; // 3-hour response window
    const now = Date.now();
    const difference = threeHoursLimit - now;

    if (difference <= 0) {
      setTimeLeftStr('00:00:00');
      setSession(null); // Triggers missed re-evaluation display state
      addLog('TIME EXPIRED. ACTIVE SESSION MARKED MISSED BY ORCHESTRATOR.');
    } else {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((difference / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');
      setTimeLeftStr(`${hours}:${minutes}:${seconds}`);
    }
  }, 1000);

  const handleBeginSession = async () => {
    if (!session) return;
    addLog('TRANSMITTING ACTIVATE SIGNAL... GENERATING INTEL INTERVIEW PAIRS.');
    try {
      const response: any = await api.post(`/daily-session/${session.id}/begin`);
      addLog('PROBLEMS INJECTED SUCCESS. STREAMING TO ARENA LAYER.');
      
      // Pass the response metadata straight into your live arena execution workspace
      navigate('/arena/dsa', { state: { dsaData: response.data } });
    } catch (err: any) {
      addLog(`INITIATE REJECTED: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center font-mono text-cyber-neonGreen animate-pulse">
        PULLING_SATELLITE_ORCHESTRATOR_METRICS...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* System Status Ribbon */}
      <div className="flex items-center justify-between border-b-2 border-cyber-border pb-4">
        <h1 className="text-xl font-black tracking-wider text-white">INTERVIEW_ARENA // GATEKEEPER</h1>
        <div className="flex items-center space-x-2 bg-cyber-surface border border-cyber-border px-3 py-1 rounded">
          <span className="text-[10px] text-cyber-textMuted font-bold">NODE_STATUS:</span>
          <span className="text-[10px] text-cyber-neonGreen font-bold tracking-widest uppercase">
            {session ? session.status : 'IDLE'}
          </span>
        </div>
      </div>

      {!session ? (
        /* Scenario A: No active session available */
        <div className="bg-cyber-surface border-2 border-cyber-border p-8 text-center shadow-brutal scanlines">
          <div className="text-cyber-textMuted text-sm font-bold mb-2">⚡ ALL CURRENT TERMINAL CHANNELS STANDING BY</div>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Your automated daily session framework hasn't fired yet or the response timeline window elapsed. System checks execute on cron alignment parameters.
          </p>
        </div>
      ) : (
        /* Scenario B: Active session waiting to be initialised */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Ticking Operational Field */}
          <div className="md:col-span-2 bg-cyber-surface border-2 border-cyber-border p-6 shadow-brutal flex flex-col justify-between scanlines">
            <div>
              <div className="text-[10px] text-cyber-textMuted font-bold tracking-widest mb-1">DECOMPRESSION_DEADLINE</div>
              <div className="text-5xl font-black tracking-tighter text-cyber-neonOrange font-mono drop-shadow-[0_0_10px_rgba(255,85,0,0.15)] mb-4">
                {timeLeftStr}
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                You have a hard 3-hour response initialization pipeline limit from execution lock. Starting this engine drops you into sequential 30-minute code/technical mock environments.
              </p>
            </div>

            {session.isLate && (
              <div className="border border-cyber-neonRed text-cyber-neonRed text-[11px] p-2 rounded mb-4 tracking-widest uppercase font-bold animate-pulse">
                ⚠️ WARNING: RETRIEVAL TRIGGER METRICS MARKED LATE WINDOW
              </div>
            )}

            <Button variant="orange" onClick={handleBeginSession} className="w-full">
              INITIALIZE_LIVE_ARENA_SESSION
            </Button>
          </div>

          {/* Core Logs Panel */}
          <div className="bg-cyber-surface border-2 border-cyber-border p-4 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-white border-b border-cyber-border pb-2 mb-3 tracking-widest">
                SYSTEM_TELEMETRY_LOGS
              </div>
              <div className="space-y-3">
                {systemLogs.map((log, i) => (
                  <div key={i} className="text-[11px] font-mono text-cyber-neonGreen leading-tight opacity-85">
                    {log}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[9px] text-cyber-textMuted font-mono border-t border-cyber-border pt-2 mt-4">
              SECURE SECURE ID: {session.id.substring(0, 12)}...
            </div>
          </div>

        </div>
      )}
    </div>
  );
};