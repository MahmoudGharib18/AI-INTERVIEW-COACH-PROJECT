import { GlitchToast } from '@/components/feedback/GlitchToast.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { APP_ROUTES } from '@/config/constants.ts';
import { sessionService } from '@/features/session/services/session.ts';
import { GithubSync } from '@/features/sync-launchpad/components/GithubSync.tsx';
import { LinkedinDraft } from '@/features/sync-launchpad/components/LinkedinDraft.tsx';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export const SyncLaunchpadPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | null>(
    (location.state as any)?.completedSessionId || null
  );
  const [loading, setLoading] = useState(!sessionId);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (sessionId) return;

    // no session passed via navigation state (e.g. user navigated here directly) —
    // fall back to checking if today's active session happens to be completed
    const resolveFallbackSession = async () => {
      try {
        const res = await sessionService.getActive();
        const active = res.data.data.session;
        if (active && active.status === 'COMPLETED') {
          setSessionId(active._id);
        }
      } catch {
        // no active session at all — sessionId stays null, handled in render below
      } finally {
        setLoading(false);
      }
    };

    resolveFallbackSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#00ff66] font-mono uppercase tracking-widest animate-pulse">
        Resolving session context...
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-mono">
        <h2 className="text-white font-black uppercase text-lg mb-2">No completed session to sync</h2>
        <p className="text-xs text-[#8a8a93] mb-6">
          Finish a daily session first, then come back here to link your GitHub work and generate a LinkedIn draft.
        </p>
        <Button variant="muted" onClick={() => navigate(APP_ROUTES.DASHBOARD)}>
          BACK_TO_DASHBOARD
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">SYNC_LAUNCHPAD_WORKSPACE</h1>
        <p className="text-xs text-[#8a8a93]">LINK YOUR REPOSITORY AND GENERATE A LINKEDIN DRAFT FOR THIS SESSION</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GithubSync
          sessionId={sessionId}
          onSyncComplete={(message, type) => setToast({ message, type })}
        />
        <LinkedinDraft sessionId={sessionId} />
      </div>

      {toast && <GlitchToast message={toast.message} type={toast.type === 'success' ? 'telemetry' : 'error'} onDismiss={() => setToast(null)} />}
    </div>
  );
};