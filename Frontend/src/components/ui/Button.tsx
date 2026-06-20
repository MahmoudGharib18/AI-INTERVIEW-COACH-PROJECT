import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'orange' | 'muted';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'neon', className = '', ...props }) => {
  const baseStyle = "font-mono font-black text-sm tracking-widest uppercase py-3 px-6 border-2 border-white transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    neon: "bg-transparent text-cyber-neonGreen border-cyber-neonGreen shadow-[4px_4px_0px_0px_#00ff66] hover:bg-cyber-neonGreen hover:text-black",
    orange: "bg-transparent text-cyber-neonOrange border-cyber-neonOrange shadow-[4px_4px_0px_0px_#ff5500] hover:bg-cyber-neonOrange hover:text-black",
    muted: "bg-transparent text-cyber-textMuted border-cyber-border shadow-[4px_4px_0px_0px_#26262b] hover:border-white hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};