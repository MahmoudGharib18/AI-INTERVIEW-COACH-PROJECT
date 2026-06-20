import React, { useRef, useEffect } from 'react';

interface Message {
  role: 'agent' | 'user';
  text: string;
  timestamp: string;
}

interface ChatFeedProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  disabled = false
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && inputValue.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-[#26262b] bg-[#121215] font-mono shadow-brutal">
      <div className="bg-[#0a0a0c] border-b border-[#26262b] px-4 py-2 text-[10px] text-[#ff5500] font-bold tracking-widest uppercase">
        📡 AI_INTERVIEW_AGENT_FEED
      </div>

      {/* Messages Window Block */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
        {messages.map((msg, index) => {
          const isAgent = msg.role === 'agent';
          return (
            <div key={index} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
              <div className={`text-[9px] mb-1 font-black uppercase tracking-wider ${isAgent ? 'text-[#ff5500]' : 'text-[#00ff66]'}`}>
                {isAgent ? 'AGENT_NODE' : 'USER_OPERATOR'} // {msg.timestamp}
              </div>
              <div className={`p-3 text-xs max-w-[85%] border leading-relaxed ${
                isAgent 
                  ? 'bg-[#0a0a0c] text-gray-200 border-[#26262b]' 
                  : 'bg-[#00ff66]/5 text-white border-[#00ff66]'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Frame Dock */}
      <div className="border-t border-[#26262b] p-2 bg-[#0a0a0c] flex items-center space-x-2">
        <textarea
          rows={1}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          placeholder={disabled ? "STREAM_LOCKED_UNAVAILABLE" : "Type operational response or dynamic verification questions..."}
          className="flex-1 bg-[#121215] border border-[#26262b] focus:border-[#ff5500] focus:outline-none p-2 text-xs text-white resize-none font-mono placeholder:text-[#26262b]"
        />
        <button
          onClick={onSendMessage}
          disabled={disabled || !inputValue.trim()}
          className="bg-[#ff5500] hover:bg-transparent text-black hover:text-[#ff5500] border border-[#ff5500] font-black text-[10px] tracking-widest px-4 py-2.5 uppercase transition-colors duration-200 disabled:opacity-20 disabled:pointer-events-none"
        >
          SEND
        </button>
      </div>
    </div>
  );
};