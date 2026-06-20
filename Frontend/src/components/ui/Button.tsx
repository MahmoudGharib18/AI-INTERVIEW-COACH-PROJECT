import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'orange' | 'red' | 'muted';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'neon', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-mono font-black text-xs tracking-widest uppercase py-3 px-5 border-2 border-white transition-all duration-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:pointer-events-none";
  
  const variants = {
    neon: "bg-transparent text-[#00ff66] border-[#00ff66] brutal-shadow-green hover:bg-[#00ff66] hover:text-black",
    orange: "bg-transparent text-[#ff5500] border-[#ff5500] brutal-shadow-orange hover:bg-[#ff5500] hover:text-black",
    red: "bg-transparent text-[#ff0033] border-[#ff0033] brutal-shadow-red hover:bg-[#ff0033] hover:text-white",
    muted: "bg-transparent text-[#8a8a93] border-[#26262b] brutal-shadow-dark hover:border-white hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};