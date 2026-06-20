import React from 'react';

interface ScanlineLoaderProps {
  statusMessage?: string;
}

export const ScanlineLoader: React.FC<ScanlineLoaderProps> = ({ statusMessage = 'PULLING_TELEMETRY_BUFFERS...' }) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-50 flex flex-col items-center justify-center font-mono p-4 scanlines">
      <div className="w-64 space-y-3">
        <div className="text-[11px] text-[#00ff66] tracking-widest text-center animate-text-glitch font-bold">
          {statusMessage}
        </div>
        <div className="w-full bg-[#121215] h-1 border border-[#26262b] relative overflow-hidden">
          <div className="bg-[#00ff66] h-full w-1/3 absolute left-0 top-0 animate-infinite-slide" />
        </div>
      </div>
    </div>
  );
};