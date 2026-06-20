import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { useInterval } from '../../../hooks/useInterval';

export const DSAArena: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure payloads passed from the Arena Gatekeeper state initialization
  const { dsaInterviewId, problems } = location.state?.dsaData || { dsaInterviewId: '', problems: [] };

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('// Write your optimized approach here...');
  const [language, setLanguage] = useState('javascript');
  const [questionInput, setQuestionInput] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'candidate' | 'interviewer'; text: string }>>([
    { sender: 'interviewer', text: 'Welcome to your technical verification phase. I am your strict algorithmic evaluator. No hints, snippets, or code architectural outlines will be exposed. You may ask for phrasing or constraint definitions. Initialize your solution.' }
  ]);

  // Timers mapped directly to your server business logic constraints: 6m Easy, 10m Medium, 14m Hard
  const durationMap = [6 * 60, 10 * 60, 14 * 60];
  const [secondsLeft, setSecondsLeft] = useState(durationMap[0]);
  const [submitting, setSubmitting] = useState(false);

  const activeProblem = problems[currentProblemIndex] || null;

  // Reset clock whenever current task shifts
  useEffect(() => {
    if (problems.length > 0) {
      setSecondsLeft(durationMap[currentProblemIndex]);
    }
  }, [currentProblemIndex]);

  // Real-time server fallback timer execution loop
  useInterval(() => {
    if (secondsLeft <= 0) {
      handleForceSubmit();
    } else {
      setSecondsLeft(prev => prev - 1);
    }
  }, 1000);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleAskInterviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !activeProblem) return;

    const userMsg = questionInput;
    setChatLog(prev => [...prev, { sender: 'candidate', text: userMsg }]);
    setQuestionInput('');

    try {
      const res: any = await api.post(`/dsa-interview/${dsaInterviewId}/clarify`, {
        questionIndex: currentProblemIndex,
        problemId: activeProblem.id || String(currentProblemIndex),
        candidateQuestion: userMsg
      });
      setChatLog(prev => [...prev, { sender: 'interviewer', text: res.data.response }]);
    } catch (err: any) {
      setChatLog(prev => [...prev, { sender: 'interviewer', text: 'SYSTEM ERROR: Telemetry leak-protection context drop.' }]);
    }
  };

  const handleForceSubmit = () => {
    handleSubmitSolution();
  };

  const handleSubmitSolution = async () => {
    if (submitting || !activeProblem) return;
    setSubmitting(true);

    try {
      await api.post(`/dsa-interview/${dsaInterviewId}/submit`, {
        questionIndex: currentProblemIndex,
        problemId: activeProblem.id || String(currentProblemIndex),
        code,
        language
      });

      if (currentProblemIndex < 2) {
        // Step forward to the next sequential problem
        setCurrentProblemIndex(prev => prev + 1);
        setCode('// Solution block initialized for subsequent problem space...');
      } else {
        // All 3 evaluated, push lifecycle forward to complete hook phase
        const finishRes: any = await api.post(`/dsa-interview/${dsaInterviewId}/complete`);
        navigate('/arena/technical-transition', { state: { sessionMetadata: finishRes.data } });
      }
    } catch (err: any) {
      console.error('Submission processing failure.', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeProblem) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center font-mono text-cyber-neonRed">
        CRITICAL ENGINE FAULT: MISSION METADATA MISSING.
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-cyber-bg overflow-hidden font-mono">
      {/* Top Telemetry Space Strip */}
      <header className="h-14 border-b-2 border-cyber-border bg-cyber-surface px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-white font-black text-sm tracking-wider">PHASE_01 // DSA_EVALUATION</span>
          <span className="bg-cyber-bg border border-cyber-border text-[11px] px-2 py-0.5 font-bold text-cyber-neonGreen rounded">
            PROBLEM {currentProblemIndex + 1} OF 3
          </span>
          <span className={`text-xs font-bold uppercase ${activeProblem.difficulty === 'Easy' ? 'text-cyber-neonGreen' : activeProblem.difficulty === 'Medium' ? 'text-cyber-neonOrange' : 'text-cyber-neonRed'}`}>
            [{activeProblem.difficulty}]
          </span>
        </div>
        
        {/* Dynamic Matrix Hard Ticking Clock */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] text-cyber-textMuted font-bold uppercase">ALLOCATED_TIME_LEFT:</span>
          <div className={`text-xl font-black ${secondsLeft < 60 ? 'text-cyber-neonRed animate-pulse' : 'text-cyber-neonGreen'}`}>
            {formatTime(secondsLeft)}
          </div>
        </div>
      </header>

      {/* Main Core Split Workspaces Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side Section: Requirements & Chat Streams */}
        <div className="w-full md:w-5/12 flex flex-col border-b md:border-b-0 md:border-r-2 border-cyber-border bg-cyber-surface overflow-y-auto p-4 space-y-4">
          
          {/* Problem Manifest Metadata Card */}
          <div className="bg-cyber-bg p-4 border border-cyber-border rounded relative">
            <h2 className="text-white font-bold text-base mb-2 uppercase tracking-wide">{activeProblem.title}</h2>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">{activeProblem.description}</p>
            
            {activeProblem.constraints && (
              <div className="mt-2 text-[11px] text-cyber-neonOrange bg-cyber-surface p-2 border border-cyber-border rounded">
                <span className="font-bold block mb-1">CONSTRAINTS_CHECK:</span>
                {activeProblem.constraints}
              </div>
            )}
          </div>

          {/* AI Evaluator Interactive Telemetry Logs */}
          <div className="flex-1 flex flex-col justify-between bg-cyber-bg border border-cyber-border rounded p-3 min-h-[250px]">
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 text-[11px]">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`p-2 rounded border ${chat.sender === 'interviewer' ? 'border-cyber-border bg-cyber-surface text-gray-300' : 'border-cyber-neonGreen/30 bg-cyber-neonGreen/5 text-cyber-neonGreen'}`}>
                  <span className="font-bold block text-[9px] mb-1 text-cyber-textMuted">{chat.sender.toUpperCase()} //</span>
                  {chat.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAskInterviewer} className="mt-3 flex items-center border border-cyber-border bg-cyber-surface rounded">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Query algorithmic terminology parameters..."
                className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="px-4 text-cyber-neonGreen font-bold text-xs hover:text-white transition">ASK</button>
            </form>
          </div>
        </div>

        {/* Right Side Section: Monaco Interactive Coding Workspace Component */}
        <div className="flex-1 flex flex-col bg-cyber-bg">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontFamily: 'Fira Code, monospace',
                fontSize: 13,
                minimap: { enabled: false },
                cursorStyle: 'block',
                lineHeight: 20,
                automaticLayout: true
              }}
            />
          </div>

          {/* Action Trigger Interface Deck Footer */}
          <footer className="h-16 border-t-2 border-cyber-border bg-cyber-surface px-4 flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-cyber-bg border border-cyber-border text-xs text-white p-2 font-mono rounded focus:outline-none focus:border-cyber-neonGreen"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>

            <Button variant="neon" onClick={handleSubmitSolution} disabled={submitting}>
              {submitting ? 'TRANSMITTING...' : currentProblemIndex < 2 ? 'COMMIT_SOLUTION_AND_NEXT' : 'FINALIZE_DSA_PHASE'}
            </Button>
          </footer>
        </div>

      </div>
    </div>
  );
};