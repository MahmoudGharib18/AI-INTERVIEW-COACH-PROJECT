import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'neon' | 'orange' | 'red' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant = 'neon' }) => {
  const styles = {
    neon: "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/5",
    orange: "border-[#ff5500] text-[#ff5500] bg-[#ff5500]/5",
    red: "border-[#ff0033] text-[#ff0033] bg-[#ff0033]/5",
    muted: "border-[#26262b] text-[#8a8a93] bg-[#121215]"
  };

  return (
    <span className={`border px-2 py-0.5 text-[9px] font-black tracking-widest font-mono uppercase rounded ${styles[variant]}`}>
      {status}
    </span>
  );
};