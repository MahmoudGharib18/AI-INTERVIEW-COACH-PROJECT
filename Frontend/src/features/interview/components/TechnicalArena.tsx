import { Button } from '@/components/ui/Button.tsx';
import { APP_ROUTES, TECHNICAL_TIME_LIMIT_SECONDS } from '@/config/constants.ts';
import { ChatFeed } from '@/features/interview/components/ChatFeed.tsx';
import { ProgressHUD } from '@/features/interview/components/ProgressHUD.tsx';
import { technicalService } from '@/features/interview/services/technical.ts';
import { sessionService } from '@/features/session/services/session.ts';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


interface TechnicalArenaProps {
  sessionId: string;
  technicalInterviewId: string;
  initialQuestion: string | null;
}

type ChatMessage = { role: 'agent' | 'user'; text: string; timestamp: string };

export const TechnicalArena: React.FC<TechnicalArenaProps> = ({
  sessionId,
  technicalInterviewId,
  initialQuestion,
}) => {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<string | null>(initialQuestion);
  const [answerInput, setAnswerInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialQuestion
      ? [{ role: 'agent', text: initialQuestion, timestamp: new Date().toLocaleTimeString() }]
      : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const finalizeInterview = useCallback(async () => {
    setFinishing(true);
    setErrorMsg(null);
    try {
      await technicalService.complete(technicalInterviewId);
      await sessionService.finish(sessionId);
      navigate(APP_ROUTES.SYNC_LAUNCHPAD, { state: { completedSessionId: sessionId } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to finalize the session.');
      setFinishing(false);
    }
  }, [technicalInterviewId, sessionId, navigate]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!answerInput.trim() || !currentQuestion) return;

    const answerText = answerInput;
    setAnswerInput('');
    setMessages((prev) => [...prev, { role: 'user', text: answerText, timestamp: new Date().toLocaleTimeString() }]);
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await technicalService.submit(technicalInterviewId, answerText);

      const nextRes = await technicalService.next(technicalInterviewId);
      const { question, timeExpired: expired } = nextRes.data.data;

      if (expired || !question) {
        setTimeExpired(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            text: 'Time is up for the technical round. Finalize when ready.',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setCurrentQuestion(question);
        setMessages((prev) => [...prev, { role: 'agent', text: question, timestamp: new Date().toLocaleTimeString() }]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit your answer.');
    } finally {
      setSubmitting(false);
    }
  }, [answerInput, currentQuestion, technicalInterviewId]);

  if (finishing) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#00ff66] font-mono uppercase tracking-widest animate-pulse">
        Finalizing session results...
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="bg-[#121215] border-2 border-[#26262b] p-4 shadow-brutal">
        <div className="text-[10px] font-black text-[#ff5500] tracking-widest uppercase mb-1">
          TECHNICAL_ROUND // SENIOR_ENGINEERING_REVIEW
        </div>
        <h2 className="text-base font-black text-white uppercase">System Design &amp; Engineering Discussion</h2>
      </div>

      <ProgressHUD
        durationSeconds={TECHNICAL_TIME_LIMIT_SECONDS}
        phaseLabel="TECHNICAL_INTERVIEW"
        onTimeExpired={() => setTimeExpired(true)}
      />

      {errorMsg && (
        <div className="bg-[#ff0033]/5 border border-[#ff0033] text-[#ff0033] p-2 text-xs uppercase font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <ChatFeed
        messages={messages}
        inputValue={answerInput}
        onInputChange={setAnswerInput}
        onSendMessage={handleSubmitAnswer}
        disabled={submitting || timeExpired}
      />

      {timeExpired && (
        <Button variant="orange" className="w-full" onClick={finalizeInterview}>
          FINALIZE_SESSION_AND_VIEW_RESULTS
        </Button>
      )}
    </div>
  );
};