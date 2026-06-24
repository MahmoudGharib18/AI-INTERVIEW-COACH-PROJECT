import { Button } from '@/components/ui/Button.tsx';
import { APP_ROUTES } from '@/config/constants.ts';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const TechnicalTransition: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const engageNextSystemMatrix = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(APP_ROUTES.ARENA_TECHNICAL);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-[#121215] border-4 border-[#26262b] shadow-brutal font-mono scanlines">
      <div className="border-b-2 border-[#26262b] pb-4 mb-6">
        <span className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
          PHASE_01_COMPLETE
        </span>
        <h1 className="text-2xl font-black text-white uppercase mt-3 tracking-tight">
          ALGORITHMIC_METRICS_LOCKED
        </h1>
        <p className="text-xs text-[#8a8a93] mt-1">
          Telemetry parsing pipelines saved. System ready to initialize architectural logic modules.
        </p>
      </div>

      <div className="space-y-4 bg-[#0a0a0c] border border-[#26262b] p-4 text-xs text-gray-400 leading-relaxed">
        <div className="text-white font-bold mb-1 uppercase tracking-wider text-[10px] text-[#ff5500]">
          ⚠️ UPCOMING // SYSTEM_DESIGN_CONSTRAINTS
        </div>
        <ul className="list-disc list-inside space-y-1">
          <li>System constraints expect focus on backend mechanics (Node.js, database indexing, caching lifecycle).</li>
          <li>Visual layout components are non-critical; concentrate on modular systems, isolation structures, and performance bounds.</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="orange" 
          className="flex-1" 
          onClick={engageNextSystemMatrix}
          disabled={loading}
        >
          {loading ? 'INITIALIZING_ARCHITECTURE_PROXY...' : 'LAUNCH_PHASE_02_ARENA'}
        </Button>
        <Button 
          variant="muted" 
          onClick={() => navigate(APP_ROUTES.DASHBOARD)}
          disabled={loading}
        >
          ABORT_TO_COMMAND
        </Button>
      </div>
    </div>
  );
};