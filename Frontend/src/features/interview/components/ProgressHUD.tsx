import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';

interface ProgressHUDProps {
  expiresAt: string;
  onTimeExpired: () => void;
  phaseLabel: string;
}

export const ProgressHUD: React.FC<ProgressHUDProps> = ({ expiresAt, onTimeExpired, phaseLabel }) => {
  const calculateRemainingSeconds = (): number => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemainingSeconds());

  useEffect(() => {
    setSecondsLeft(calculateRemainingSeconds());
  }, [expiresAt]);

  useInterval(() => {
    const remaining = calculateRemainingSeconds();
    setSecondsLeft(remaining);
    if (remaining <= 0) {
      onTimeExpired();
    }
  }, 1000);

  const formatClock = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = secondsLeft < 60;

  return (
    <div className={`bg-[#121215] border-2 p-3 font-mono flex items-center justify-between shadow-brutal transition-colors duration-300 ${
      isCritical ? 'border-[#ff0033] bg-[#ff0033]/5' : 'border-[#26262b]'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-[#ff0033] animate-ping' : 'bg-[#00ff66] animate-pulse'}`} />
        <span className="text-[10px] font-black text-[#8a8a93] tracking-widest uppercase">
          SYS_PHASE // <span className="text-white">{phaseLabel}</span>
        </span>
      </div>
      
      <div className="flex items-baseline space-x-2">
        <span className="text-[9px] font-bold text-[#8a8a93]">EXEC_TIME_REMAINING:</span>
        <span className={`text-xl font-black tracking-tighter ${isCritical ? 'text-[#ff0033]' : 'text-[#00ff66]'}`}>
          {formatClock(secondsLeft)}
        </span>
      </div>
    </div>
  );
};