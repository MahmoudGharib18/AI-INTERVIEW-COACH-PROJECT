import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GuardedRoute } from './GuardedRoute';
import { APP_ROUTES } from '../config/constants';
import { api } from '../lib/api-client';

// Component Feature Layout Imports
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AuthConsole } from '../features/auth/components/AuthConsole';
import { useAuthActions } from '../features/auth/hooks/useAuthActions';
import { MetricGrid, TrendChart, RiskMatrix } from '../features/dashboard';
import { ArenaHUD } from '../features/interview';
import { GithubSync, LinkedinDraft } from '../features/sync-launchpad';

export const AppRoutes: React.FC = () => {
  const { executeLogout } = useAuthActions();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreakTelemetry = async () => {
      try {
        const response: any = await api.get('/progress/overview');
        if (response && response.data) {
          setStreak(response.data.streakCount || 0);
        }
      } catch (err) {
        console.warn('Volatile streak counter disconnected from database context.');
      }
    };
    fetchStreakTelemetry();
  }, []);

  return (
    <Routes>
      {/* Public Guest Authorization Channels */}
      <Route path={APP_ROUTES.LOGIN} element={<AuthConsole />} />
      <Route path={APP_ROUTES.REGISTER} element={<Navigate to={APP_ROUTES.LOGIN} replace />} />

      {/* Command Center Dashboard Workspaces */}
      <Route
        path={APP_ROUTES.DASHBOARD}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">OPERATOR_COMMAND_CENTER</h1>
                  <p className="text-xs text-[#8a8a93]">SYSTEM STATUS: ALL CORE PIPELINES FUNCTIONAL // ACTIVE RUNTIME MONITORING</p>
                </div>
                <MetricGrid />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TrendChart />
                  </div>
                  <div>
                    <RiskMatrix />
                  </div>
                </div>
              </div>
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      {/* Multi-Agent Interview Arenas */}
      <Route
        path={APP_ROUTES.ARENA_GATEKEEPER}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">EXECUTION_ARENA</h1>
                  <p className="text-xs text-[#8a8a93]">SELECT RUNTIME PROTOCOL VECTOR TO INITIALIZE SYSTEM EVALUATION</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="bg-[#121215] border-2 border-[#26262b] p-6 shadow-brutal hover:border-[#00ff66] transition-colors duration-300">
                    <div className="text-xs font-black text-[#00ff66] tracking-widest mb-2">VECTOR_01 // ALGORITHMIC_DSA</div>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">Runs automated data structures tracking sequences with short timelines (6m / 10m / 14m bounds) backed by live prompt clarifiers.</p>
                    <a href="/arena/dsa" className="inline-block border border-[#00ff66] text-[#00ff66] font-mono font-black text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-[#00ff66] hover:text-black transition-colors">[ ENGAGE DSA PROXY ]</a>
                  </div>

                  <div className="bg-[#121215] border-2 border-[#26262b] p-6 shadow-brutal hover:border-[#ff5500] transition-colors duration-300">
                    <div className="text-xs font-black text-[#ff5500] tracking-widest mb-2">VECTOR_02 // SYSTEM_ARCHITECTURE</div>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">Simulates complex backend technical examinations focused on performance patterns, caching layers, and database scaling boundaries.</p>
                    <a href="/arena/technical" className="inline-block border border-[#ff5500] text-[#ff5500] font-mono font-black text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-[#ff5500] hover:text-black transition-colors">[ ENGAGE TECH PROXY ]</a>
                  </div>
                </div>
              </div>
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      <Route
        path={APP_ROUTES.ARENA_DSA}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <ArenaHUD sessionType="dsa" onPhaseCompleted={() => window.location.href = APP_ROUTES.DASHBOARD} />
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      <Route
        path={APP_ROUTES.ARENA_TECHNICAL}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <ArenaHUD sessionType="technical" onPhaseCompleted={() => window.location.href = APP_ROUTES.SYNC_LAUNCHPAD} />
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      {/* Sync Launchpads & Shared Content Extractors */}
      <Route
        path={APP_ROUTES.SYNC_LAUNCHPAD}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">SYNC_LAUNCHPAD_WORKSPACE</h1>
                  <p className="text-xs text-[#8a8a93]">LINK HARD CODING ARTIFACT COMMITS AND EXTRACT PROFESSIONAL NETWORKING DRAFTS</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GithubSync onSyncComplete={(msg, type) => alert(`[SYS_SYNC] ${msg}`)} />
                  <LinkedinDraft />
                </div>
              </div>
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      {/* Catch-all Wildcard Re-routing Fallback */}
      <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};