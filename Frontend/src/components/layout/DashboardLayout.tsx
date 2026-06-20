import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  streakCount: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, streakCount }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cyber-bg text-gray-200">
      {/* Tactical Side Control Grid */}
      <aside className="w-full md:w-64 bg-cyber-surface border-b md:border-b-0 md:border-r border-cyber-border flex flex-col justify-between p-4 scanlines">
        <div>
          <div className="flex items-center space-x-2 border-b-2 border-cyber-border pb-4 mb-6">
            <div className="w-3 h-3 bg-cyber-neonGreen rounded-full animate-pulse" />
            <span className="font-black tracking-wider text-sm text-white">CORE//ORCHESTRATOR</span>
          </div>
          
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center space-x-2 p-2 rounded border border-transparent hover:border-cyber-neonGreen hover:bg-cyber-bg transition group">
              <span className="text-cyber-textMuted group-hover:text-cyber-neonGreen">01//</span>
              <span className="font-bold text-sm tracking-tight">COMMAND_CENTER</span>
            </a>
            <a href="/arena/gatekeeper" className="flex items-center space-x-2 p-2 rounded border border-transparent hover:border-cyber-neonOrange hover:bg-cyber-bg transition group">
              <span className="text-cyber-textMuted group-hover:text-cyber-neonOrange">02//</span>
              <span className="font-bold text-sm tracking-tight">INTERVIEW_ARENA</span>
            </a>
            <a href="/workspace/sync" className="flex items-center space-x-2 p-2 rounded border border-transparent hover:border-cyber-neonGreen hover:bg-cyber-bg transition group">
              <span className="text-cyber-textMuted group-hover:text-cyber-neonGreen">03//</span>
              <span className="font-bold text-sm tracking-tight">SYNC_LAUNCHPAD</span>
            </a>
          </nav>
        </div>

        {/* Persistent Micro Telemetry Block */}
        <div className="mt-auto border-t-2 border-cyber-border pt-4">
          <div className="bg-cyber-bg p-3 border border-cyber-border rounded">
            <div className="text-[10px] text-cyber-textMuted mb-1">STREAK_CORE_ENERGY</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-cyber-neonGreen tracking-tighter drop-shadow-neon">
                {streakCount}D
              </span>
              <span className="text-[10px] text-cyber-neonGreen font-bold">ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Core View Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};