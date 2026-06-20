import React, { useEffect } from 'react';

interface GlitchToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
}

export const GlitchToast: React.FC<GlitchToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 border-2 p-4 max-w-sm font-mono text-xs shadow-brutal bg-[#121215] ${
      type === 'error' ? 'border-[#ff0033] text-[#ff0033]' : 'border-[#00ff66] text-[#00ff66]'
    }`}>
      <div className="flex items-center space-x-2">
        <span className="font-bold">{type === 'error' ? '⚡ SYS_FAULT //' : '⚙️ SYS_OK //'}</span>
        <span className="text-white font-medium">{message.toUpperCase()}</span>
      </div>
    </div>
  );
};