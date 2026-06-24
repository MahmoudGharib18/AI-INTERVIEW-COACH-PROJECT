import { Button } from '@/components/ui/Button.tsx';
import { APP_ROUTES, DSA_TIME_LIMITS_SECONDS } from '@/config/constants.ts';
import { ChatFeed } from '@/features/interview/components/ChatFeed.tsx';
import { CodeConsole } from '@/features/interview/components/CodeConsole.tsx';
import { ProgressHUD } from '@/features/interview/components/ProgressHUD.tsx';
import { dsaService } from '@/features/interview/services/dsa.ts';
import { sessionService } from '@/features/session/services/session.ts';
import type { Problem } from '@/types/index.ts';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


interface DSAArenaProps {
  sessionId: string;
  dsaInterviewId: string;
  problems: Problem[];
  initialIndex?: number;
  initialRemainingSeconds?: number;
}

type ChatMessage = { role: 'agent' | 'user'; text: string; timestamp: string };

export const DSAArena: React.FC<DSAArenaProps> = ({ sessionId, dsaInterviewId, problems, initialIndex = 0, initialRemainingSeconds, }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [code, setCode] = useState('// Write your solution here...\n');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeProblem = problems[activeIndex];
  const isLastProblem = activeIndex === problems.length - 1;
  const durationSeconds =
    activeIndex === initialIndex && initialRemainingSeconds !== undefined
      ? initialRemainingSeconds
      : DSA_TIME_LIMITS_SECONDS[activeProblem.difficulty];

  // reset code + chat whenever we move to a new problem
  useEffect(() => {
    setCode('// Write your solution here...\n');
    setMessages([
      {
        role: 'agent',
        text: activeProblem.description,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setErrorMsg(null);
  }, [activeIndex, activeProblem.description]);

  const handleClarify = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText, timestamp: new Date().toLocaleTimeString() }]);

    try {
      const res = await dsaService.clarify(dsaInterviewId, {
        questionIndex: activeIndex,
        problemId: activeProblem._id,
        candidateQuestion: userText,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: res.data.data.response, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: `Connection error: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const submitCurrentProblem = useCallback(async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await dsaService.submit(dsaInterviewId, {
        questionIndex: activeIndex,
        problemId: activeProblem._id,
        code,
        language: 'javascript',
      });

      if (isLastProblem) {
        setAdvancing(true);
        await dsaService.complete(dsaInterviewId);
        await sessionService.advanceToTechnical(sessionId);
        navigate(APP_ROUTES.ARENA_TECHNICAL);
      } else {
        setActiveIndex((prev) => prev + 1);
      }
    } catch (err: any) {
      // a 408 (time limit exceeded) still records the submission server-side —
      // treat it the same as a successful submit and advance, rather than blocking the user
      if (err.message?.toLowerCase().includes('time limit')) {
        if (isLastProblem) {
          setAdvancing(true);
          try {
            await dsaService.complete(dsaInterviewId);
            await sessionService.advanceToTechnical(sessionId);
            navigate(APP_ROUTES.ARENA_TECHNICAL);
          } catch (innerErr: any) {
            setErrorMsg(innerErr.message || 'Failed to advance to the technical round.');
            setAdvancing(false);
          }
        } else {
          setActiveIndex((prev) => prev + 1);
        }
      } else {
        setErrorMsg(err.message || 'Submission failed — please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [activeIndex, activeProblem, code, dsaInterviewId, isLastProblem, navigate, sessionId]);

  const handleTimeExpired = useCallback(() => {
    if (!submitting && !advancing) {
      submitCurrentProblem();
    }
  }, [submitting, advancing, submitCurrentProblem]);

  if (advancing) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#00ff66] font-mono uppercase tracking-widest animate-pulse">
        Compiling DSA results — preparing technical round...
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="bg-[#121215] border-2 border-[#26262b] p-4 shadow-brutal">
        <div className="text-[10px] font-black text-[#00ff66] tracking-widest uppercase mb-1">
          PROBLEM {activeIndex + 1} OF {problems.length} // {activeProblem.difficulty}
        </div>
        <h2 className="text-base font-black text-white uppercase">{activeProblem.title}</h2>
      </div>

      <ProgressHUD
        durationSeconds={durationSeconds}
        phaseLabel={`DSA_${activeProblem.difficulty}`}
        onTimeExpired={handleTimeExpired}
      />

      {errorMsg && (
        <div className="bg-[#ff0033]/5 border border-[#ff0033] text-[#ff0033] p-2 text-xs uppercase font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-3">
          <div className="bg-[#121215] border-2 border-[#26262b] p-4 text-xs leading-relaxed text-gray-300 shadow-brutal max-h-48 overflow-y-auto">
            <span className="text-white font-black block mb-2 border-b border-[#26262b] pb-1 uppercase">
              🎯 PROBLEM_CONSTRAINTS
            </span>
            <p className="whitespace-pre-wrap mb-2">{activeProblem.description}</p>
            <ul className="list-disc list-inside space-y-0.5 text-[#8a8a93]">
              {activeProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <CodeConsole code={code} onChange={setCode} language="javascript" />
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div className="flex-1">
            <ChatFeed
              messages={messages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSendMessage={handleClarify}
              disabled={submitting}
            />
          </div>

          <Button variant="orange" className="w-full" onClick={submitCurrentProblem} disabled={submitting}>
            {submitting
              ? 'SUBMITTING...'
              : isLastProblem
                ? 'SUBMIT_FINAL_PROBLEM_AND_ADVANCE'
                : 'SUBMIT_AND_CONTINUE'}
          </Button>
        </div>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Problem statement */}
        <div className="bg-[#121215] border-2 border-[#26262b] p-4 text-xs leading-relaxed text-gray-300 shadow-brutal max-h-[500px] overflow-y-auto">
          <span className="text-white font-black block mb-2 border-b border-[#26262b] pb-1 uppercase">
            🎯 PROBLEM_CONSTRAINTS
          </span>
          <p className="whitespace-pre-wrap mb-2">{activeProblem.description}</p>
          <ul className="list-disc list-inside space-y-0.5 text-[#8a8a93]">
            {activeProblem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Column 2: Code editor */}
        <div className="flex flex-col min-h-[500px]">
          <CodeConsole code={code} onChange={setCode} language="javascript" />
        </div>

        {/* Column 3: Chat feed */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1">
            <ChatFeed
              messages={messages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSendMessage={handleClarify}
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      <Button variant="orange" className="w-full" onClick={submitCurrentProblem} disabled={submitting}>
        {submitting
          ? 'SUBMITTING...'
          : isLastProblem
            ? 'SUBMIT_FINAL_PROBLEM_AND_ADVANCE'
            : 'SUBMIT_AND_CONTINUE'}
      </Button>
    </div>
  );
};