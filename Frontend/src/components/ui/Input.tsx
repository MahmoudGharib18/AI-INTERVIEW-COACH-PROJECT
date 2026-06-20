import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className={`block text-[10px] font-black tracking-widest font-mono mb-1 uppercase ${error ? 'text-[#ff0033]' : 'text-[#8a8a93]'}`}>
        {label}
      </label>
      <input
        className={`w-full bg-[#0a0a0c] border-2 p-2.5 font-mono text-xs text-white focus:outline-none transition-colors duration-200 ${
          error ? 'border-[#ff0033] focus:border-[#ff0033]' : 'border-[#26262b] focus:border-[#00ff66]'
        } ${className}`}
        {...props}
      />
    </div>
  );
};