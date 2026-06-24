import { APP_ROUTES } from '@/config/constants.ts';
import { useTour } from '@/context/TourContext.tsx';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


interface DashboardLayoutProps {
  children: React.ReactNode;
  streakCount: number;
  onLogout: () => Promise<void>;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, streakCount, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTour } = useTour();

  const navItems = [
    { label: 'COMMAND_CENTER', path: APP_ROUTES.DASHBOARD, idx: '01', tourId: 'tour-nav-dashboard' },
    { label: 'INTERVIEW_ARENA', path: APP_ROUTES.ARENA_GATEKEEPER, idx: '02', tourId: 'tour-nav-arena' },
    { label: 'SYNC_LAUNCHPAD', path: APP_ROUTES.SYNC_LAUNCHPAD, idx: '03', tourId: 'tour-nav-sync' },
    { label: 'OPERATOR_SETTINGS', path: APP_ROUTES.SETTINGS, idx: '04', tourId: 'tour-nav-settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0c] text-gray-200">
      <aside className="w-full md:w-64 bg-[#121215] border-b md:border-b-0 md:border-r border-[#26262b] flex flex-col justify-between p-4 scanlines">
        <div>
          <div className="flex items-center justify-between border-b-2 border-[#26262b] pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#00ff66] rounded-full animate-pulse" />
              <span className="font-black tracking-wider text-xs text-white">SYS//ORCHESTRATOR</span>
            </div>
            <button
              onClick={startTour}
              title="Replay platform guide"
              className="text-[9px] border border-[#26262b] hover:border-[#00ff66] text-[#8a8a93] hover:text-[#00ff66] px-2 py-1 uppercase font-bold tracking-widest transition-colors"
            >
              [?] GUIDE
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  data-tour-id={item.tourId}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 p-2.5 text-left border transition-all duration-150 group font-mono ${
                    isActive
                      ? 'border-[#00ff66] bg-[#0a0a0c] text-white'
                      : 'border-transparent text-[#8a8a93] hover:border-[#26262b] hover:bg-[#0a0a0c] hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#00ff66]' : 'text-[#26262b] group-hover:text-[#8a8a93]'}>
                    {item.idx}//
                  </span>
                  <span className="text-xs font-bold tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-3 pt-4 border-t border-[#26262b]">
          <div data-tour-id="tour-streak-widget" className="bg-[#0a0a0c] p-3 border border-[#26262b] rounded">
            <div className="text-[9px] text-[#8a8a93] font-black tracking-widest mb-1">STREAK_STABILITY_CORE</div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-[#00ff66] tracking-tighter">
                {streakCount}D
              </span>
              <span className="text-[9px] text-[#00ff66] font-bold tracking-wider">ON_LINE</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full text-left font-mono text-[10px] font-bold text-[#8a8a93] hover:text-[#ff0033] p-1 transition-colors uppercase tracking-widest"
          >
            [📡 DISCONNECT_CORE]
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};