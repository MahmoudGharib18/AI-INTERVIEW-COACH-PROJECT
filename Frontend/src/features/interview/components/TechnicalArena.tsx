import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { useInterval } from '../../../hooks/useInterval';

export const TechnicalArena: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const technicalData = location.state?.technicalData || {};
  
  const interviewId = technicalData.interviewId || '';
  const initialQuestion = technicalData.firstQuestion || 'Describe a high-throughput architectural approach for building a decoupled notification messaging pipeline using Redis / BullMQ.';

  const [chatLog, setChatLog] = useState<Array<{ sender: 'candidate' | 'interviewer'; text: string }>>([
    { sender: 'interviewer', text: initialQuestion }
  ]);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60); // Rigid 30-minute block

  useInterval(() => {
    if (secondsLeft <= 0) {
      handleFinalizeSession();
    } else {
      setSecondsLeft(prev => prev - 1);
    }
  }, 1000);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleTransmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateResponse.trim() || submitting) return;

    const currentInput = candidateResponse;
    setChatLog(prev => [...prev, { sender: 'candidate', text: currentInput }]);
    setCandidateResponse('');
    setSubmitting(true);

    try {
      // Connects directly to POST /api/technical-interview/:interviewId/submit
      const res: any = await api.post(`/technical-interview/${interviewId}/submit`, {
        answer: currentInput
      });

      if (res.data.isComplete) {
        handleFinalizeSession();
      } else {
        // Feed the follow-up or next scenario step directly back into chat layout stream
        setChatLog(prev => [...prev, { sender: 'interviewer', text: res.data.nextQuestion }]);
      }
    } catch (err: any) {
      setChatLog(prev => [...prev, { sender: 'interviewer', text: 'TRANSMISSION ERROR: AI context line decoupled.' }]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalizeSession = async () => {
    try {
      // Call endpoint to run overall aggregation data compiling
      const response: any = await api.post(`/daily-session/${technicalData.sessionId}/finish`);
      navigate('/dashboard', { state: { evaluationReport: response.data } });
    } catch (err) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-cyber-bg overflow-hidden font-mono text-gray-200">
      {/* HUD Telemetry Top Header */}
      <header className="h-14 border-b-2 border-cyber-border bg-cyber-surface px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-cyber-neonOrange rounded-full animate-pulse" />
          <span className="text-white font-black text-sm tracking-widest">PHASE_02 // ARCHITECTURE_SCENARIO_MOCK</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] text-cyber-textMuted font-bold uppercase">REMAINING_BLOCK:</span>
          <span className={`text-xl font-black ${secondsLeft < 120 ? 'text-cyber-neonRed animate-pulse' : 'text-cyber-neonOrange'}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>
      </header>

      {/* Main Terminal Chat Display Grid */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Active Telemetry Stream Window */}
        <div className="flex-1 bg-cyber-surface border-2 border-cyber-border rounded p-4 overflow-y-auto space-y-4 mb-4 scanlines">
          {chatLog.map((message, i) => (
            <div key={i} className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-3 border rounded text-xs leading-relaxed ${message.sender === 'candidate' ? 'bg-cyber-neonOrange/5 border-cyber-neonOrange/30 text-cyber-neonOrange' : 'bg-cyber-bg border-cyber-border text-gray-300'}`}>
                <div className="text-[9px] font-bold text-cyber-textMuted mb-1 uppercase tracking-wider">
                  {message.sender === 'candidate' ? 'CANDIDATE // RESP' : 'SENIOR_ENGINEER // INTERVIEWER'}
                </div>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Interface Layer Form */}
        <form onSubmit={handleTransmitAnswer} className="flex items-center space-x-4 bg-cyber-surface border-2 border-cyber-border p-2 rounded">
          <textarea
            rows={2}
            value={candidateResponse}
            onChange={(e) => setCandidateResponse(e.target.value)}
            placeholder="Type comprehensive engineering logic formulation here... (Press Shift+Enter for new line)"
            className="flex-1 bg-transparent border-0 text-xs text-white p-2 focus:outline-none resize-none font-mono placeholder-cyber-textMuted"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTransmitAnswer(e);
              }
            }}
          />
          <Button type="submit" variant="orange" disabled={submitting} className="h-full py-4">
            {submitting ? 'SENDING...' : 'TRANSMIT'}
          </Button>
        </form>

      </div>
    </div>
  );
};