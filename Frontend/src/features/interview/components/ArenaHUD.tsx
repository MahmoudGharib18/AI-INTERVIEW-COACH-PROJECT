import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import { ProgressHUD } from './ProgressHUD';
import { CodeConsole } from './CodeConsole';
import { ChatFeed } from './ChatFeed';
import { Button } from '../../../components/ui/Button';

interface ArenaHUDProps {
  sessionType: 'dsa' | 'technical';
  onPhaseCompleted: () => void;
}

export const ArenaHUD: React.FC<ArenaHUDProps> = ({ sessionType, onPhaseCompleted }) => {
  const [code, setCode] = useState('// Initialize algorithmic logic here...\n');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'agent' | 'user'; text: string; timestamp: string }[]>([]);
  const [expirationTime, setExpirationTime] = useState<string>(new Date(Date.now() + 10 * 60 * 1000).toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('Fetching operational evaluation setup problem node data...');

  const endpointPath = sessionType === 'dsa' ? '/dsa-interview' : '/technical-interview';

  useEffect(() => {
    const startArenaSession = async () => {
      try {
        // Triggers phase creation matching POST /api/dsa-interview/start in API_REFERENCE.md
        const res: any = await api.post(`${endpointPath}/start`);
        if (res && res.data) {
          setCurrentPrompt(res.data.problem?.description || res.data.question || 'Setup extracted successfully.');
          setMessages([{
            role: 'agent',
            text: res.data.problem?.description || res.data.question || 'Begin execution pattern sequence immediately.',
            timestamp: new Date().toLocaleTimeString()
          }]);
          if (res.data.expiresAt) {
            setExpirationTime(res.data.expiresAt);
          }
        }
      } catch (err: any) {
        setCurrentPrompt(`CRITICAL_ARENA_INITIALIZATION_FAULT: ${err.message || 'Check database pipelines.'}`);
      }
    };
    startArenaSession();
  }, [sessionType]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: new Date().toLocaleTimeString() }]);

    try {
      // Direct correlation with POST /api/dsa-interview/clarify or technical equivalent mapping parameters
      const res: any = await api.post(`${endpointPath}/clarify`, { question: userText });
      if (res && res.data) {
        setMessages(prev => [...prev, {
          role: 'agent',
          text: res.data.response || 'Clarification received and cached.',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', text: 'SYSTEM_ROUTING_ERROR: Failed to transmit statement.', timestamp: new Date().toLocaleTimeString() }]);
    }
  };

  const handleFinalCompilationSubmit = async () => {
    setSubmitting(true);
    try {
      // Maps precisely to POST /api/dsa-interview/submit matching API_REFERENCE.md
      await api.post(`${endpointPath}/submit`, {
        code: sessionType === 'dsa' ? code : undefined,
        answer: sessionType === 'technical' ? code : undefined,
        language: 'javascript'
      });
      onPhaseCompleted();
    } catch (err) {
      console.error('Final matrix lock error', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <ProgressHUD 
        expiresAt={expirationTime} 
        phaseLabel={`${sessionType.toUpperCase()}_EVALUATION_MATRIX`} 
        onTimeExpired={handleFinalCompilationSubmit} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Hand: Monaco Code Engine Panel */}
        <div className="flex flex-col space-y-3">
          <div className="bg-[#121215] border-2 border-[#26262b] p-4 text-xs leading-relaxed text-gray-300 shadow-brutal select-text">
            <span className="text-white font-black block mb-2 border-b border-[#26262b] pb-1 uppercase">🎯 PROBLEM_NODE_CONSTRAINTS</span>
            {currentPrompt}
          </div>
          <div className="flex-1">
            <CodeConsole code={code} onChange={setCode} language={sessionType === 'dsa' ? 'javascript' : 'markdown'} />
          </div>
        </div>

        {/* Right Hand: Interactive Chat Streams */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="flex-1">
            <ChatFeed 
              messages={messages} 
              inputValue={chatInput} 
              onInputChange={setChatInput} 
              onSendMessage={handleSendMessage} 
              disabled={submitting} 
            />
          </div>

          <Button variant="orange" className="w-full" onClick={handleFinalCompilationSubmit} disabled={submitting}>
            {submitting ? 'COMPILING_SUBMISSION_REPORT...' : 'LOCK_AND_SUBMIT_PHASE_METRICS'}
          </Button>
        </div>
      </div>
    </div>
  );
};