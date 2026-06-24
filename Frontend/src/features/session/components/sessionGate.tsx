import { Button } from '@/components/ui/Button.tsx';
import { APP_ROUTES, DSA_TIME_LIMITS_SECONDS } from '@/config/constants.ts';
import { DSAArena, TechnicalArena } from '@/features/interview/index.ts';
import { dsaService } from '@/features/interview/services/dsa.ts';
import { technicalService } from '@/features/interview/services/technical.ts';
import { sessionService } from '@/features/session/services/session.ts';
import type { Problem, Session } from '@/types/index.ts';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


type GateView = 'loading' | 'no-session' | 'dsa' | 'technical' | 'completed' | 'missed' | 'error';

interface ResumedDsaState {
  activeIndex: number;
  remainingSeconds: number;
}

export const SessionGate: React.FC = () => {
  const navigate = useNavigate();
  const hasLoadedRef = useRef(false);
  const [view, setView] = useState<GateView>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [dsaInterviewId, setDsaInterviewId] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [resumedDsa, setResumedDsa] = useState<ResumedDsaState | null>(null);

  const [technicalInterviewId, setTechnicalInterviewId] = useState<string | null>(null);
  const [firstQuestion, setFirstQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    const loadSession = async () => {
      try {
        const res = await sessionService.getActive();
        const active = res.data.data.session;

        if (!active) {
          setView('no-session');
          return;
        }

        setSession(active);

        if (active.isMissed) {
          setView('missed');
          return;
        }

        if (active.status === 'COMPLETED') {
          setView('completed');
          return;
        }

        if (active.status === 'PENDING' || active.status === 'EMAIL_SENT') {
          const beginRes = await sessionService.begin(active._id);
          setDsaInterviewId(beginRes.data.data.dsaInterviewId);
          setProblems(beginRes.data.data.problems);
          setView('dsa');
          return;
        }

        if (active.status === 'DSA_IN_PROGRESS') {
          if (!active.dsaInterview) {
            setErrorMsg('Session is in progress but missing its DSA interview reference.');
            setView('error');
            return;
          }
          await resumeDsa(active.dsaInterview);
          return;
        }

        if (active.status === 'TECHNICAL_IN_PROGRESS') {
          if (!active.technicalInterview) {
            setErrorMsg('Session is in progress but missing its technical interview reference.');
            setView('error');
            return;
          }
          await resumeTechnical(active.technicalInterview);
          return;
        }

        setView('error');
        setErrorMsg(`Unrecognized session status: ${active.status}`);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load your session.');
        setView('error');
      }
    };

    const resumeDsa = async (interviewId: string) => {
      try {
        const interviewRes = await dsaService.getById(interviewId);
        const interview = interviewRes.data.data.interview;

        const pendingIndex = interview.questions.findIndex((q) => !q.answer);

        if (pendingIndex === -1) {
          // every question answered but interview never completed — let the user finalize
          setErrorMsg('All DSA problems were answered but the round was never finalized. Please contact support to resolve this session.');
          setView('error');
          return;
        }

        // we don't have the original Problem documents from this endpoint, only the
        // presented question text — reconstruct minimal Problem-shaped objects so
        // DSAArena can render. Full problem metadata (constraints/examples) is lost
        // on resume; this is a known limitation.
        const reconstructedProblems: Problem[] = interview.questions.map((q, i) => ({
          _id: `resumed-${i}`,
          title: `Problem ${i + 1}`,
          description: q.question,
          difficulty: i === 0 ? 'EASY' : i === 1 ? 'MEDIUM' : 'HARD',
          constraints: [],
          examples: [],
          tags: [],
        }));

        const presentedAt = new Date(interview.questions[pendingIndex].presentedAt).getTime();
        const difficulty = reconstructedProblems[pendingIndex].difficulty;
        const limitSeconds = DSA_TIME_LIMITS_SECONDS[difficulty];
        const elapsedSeconds = Math.floor((Date.now() - presentedAt) / 1000);
        const remainingSeconds = Math.max(limitSeconds - elapsedSeconds, 0);

        setDsaInterviewId(interviewId);
        setProblems(reconstructedProblems);
        setResumedDsa({ activeIndex: pendingIndex, remainingSeconds });
        setView('dsa');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to resume DSA round.');
        setView('error');
      }
    };

    const resumeTechnical = async (interviewId: string) => {
      try {
        const interviewRes = await technicalService.getById(interviewId);
        const interview = interviewRes.data.data.interview;

        const pendingIndex = interview.questions.findIndex((q) => !q.answer);

        if (pendingIndex === -1) {
          // last question was answered but /next or /complete was never called —
          // resume by asking for the next question, same as normal flow would
          setTechnicalInterviewId(interviewId);
          setFirstQuestion(null);
          setView('technical');
          return;
        }

        setTechnicalInterviewId(interviewId);
        setFirstQuestion(interview.questions[pendingIndex].question);
        setView('technical');
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to resume technical round.');
        setView('error');
      }
    };

    loadSession();
  }, []);

  if (view === 'loading') {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#00ff66] font-mono uppercase tracking-widest animate-pulse">
        Loading today's session...
      </div>
    );
  }

  if (view === 'no-session') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-mono">
        <h2 className="text-white font-black uppercase text-lg mb-2">No session scheduled yet</h2>
        <p className="text-xs text-[#8a8a93] mb-6">
          Your daily session is created automatically at your preferred interview time. Check back then.
        </p>
        <Button variant="muted" onClick={() => navigate(APP_ROUTES.DASHBOARD)}>
          BACK_TO_DASHBOARD
        </Button>
      </div>
    );
  }

  if (view === 'missed') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-mono">
        <h2 className="text-[#ff0033] font-black uppercase text-lg mb-2">Session missed</h2>
        <p className="text-xs text-[#8a8a93] mb-6">
          Today's session window closed before it was started. Your streak has been reset. Tomorrow's session will arrive on schedule.
        </p>
        <Button variant="muted" onClick={() => navigate(APP_ROUTES.DASHBOARD)}>
          BACK_TO_DASHBOARD
        </Button>
      </div>
    );
  }

  if (view === 'completed') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-mono">
        <h2 className="text-[#00ff66] font-black uppercase text-lg mb-2">Session already completed</h2>
        <p className="text-xs text-[#8a8a93] mb-2">
          Overall score: <span className="text-white font-bold">{session?.overallScore ?? '—'}</span>
        </p>
        <p className="text-xs text-[#8a8a93] mb-6">{session?.summary}</p>
        <Button variant="muted" onClick={() => navigate(APP_ROUTES.DASHBOARD)}>
          BACK_TO_DASHBOARD
        </Button>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-mono">
        <h2 className="text-[#ff0033] font-black uppercase text-lg mb-2">Something went wrong</h2>
        <p className="text-xs text-[#8a8a93] mb-6">{errorMsg}</p>
        <Button variant="muted" onClick={() => navigate(APP_ROUTES.DASHBOARD)}>
          BACK_TO_DASHBOARD
        </Button>
      </div>
    );
  }

  if (view === 'dsa' && session && dsaInterviewId && problems.length > 0) {
    return (
      <DSAArena
        sessionId={session._id}
        dsaInterviewId={dsaInterviewId}
        problems={problems}
        initialIndex={resumedDsa?.activeIndex}
        initialRemainingSeconds={resumedDsa?.remainingSeconds}
      />
    );
  }

  if (view === 'technical' && session && technicalInterviewId) {
    return (
      <TechnicalArena
        sessionId={session._id}
        technicalInterviewId={technicalInterviewId}
        initialQuestion={firstQuestion}
      />
    );
  }

  return null;
};