import React, { useEffect } from 'react';

interface GlitchToastProps {
  message: string;
  type?: 'error' | 'telemetry' | 'warn';
  onDismiss: () => void;
  duration?: number;
}

export const GlitchToast: React.FC<GlitchToastProps> = ({ 
  message, 
  type = 'error', 
  onDismiss, 
  duration = 4000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const borderVariantColor = 
    type === 'error' ? 'border-[#ff0033] text-[#ff0033]' : 
    type === 'warn' ? 'border-[#ff5500] text-[#ff5500]' : 'border-[#00ff66] text-[#00ff66]';

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-[#0a0a0c] border-2 p-4 font-mono shadow-brutal animate-bounce text-xs max-w-sm ${borderVariantColor}`}>
      <div className="flex items-start justify-between space-x-3">
        <div>
          <span className="font-black tracking-widest block mb-1 uppercase">
            ⚠️ SYSTEM_{type.toUpperCase()}_ALERT
          </span>
          <p className="text-white leading-relaxed tracking-tight uppercase select-all">{message}</p>
        </div>
        <button 
          onClick={onDismiss} 
          className="text-gray-500 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          [X]
        </button>
      </div>
    </div>
  );
};