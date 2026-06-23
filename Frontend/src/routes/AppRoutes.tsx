import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GuardedRoute } from './GuardedRoute';
import { APP_ROUTES } from '../config/constants';
import { api } from '../lib/api-client';
import type { ApiResponse, ProgressOverview } from '../types';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AuthConsole } from '../features/auth/components/AuthConsole';
import { useAuthActions } from '../features/auth/hooks/useAuthActions';
import { MetricGrid, TrendChart, RiskMatrix } from '../features/dashboard';
import { SettingsPanel } from '../features/settings/components/SettingsPanel';
import { SyncLaunchpadPage } from '../features/sync-launchpad/components/SyncLaunchpadPage';
import { SessionGate } from '@/features/session/components/sessionGate.tsx';

export const AppRoutes: React.FC = () => {
  const { executeLogout } = useAuthActions();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await api.get<ApiResponse<{ overview: ProgressOverview }>>('/progress/overview');
        setStreak(response.data.data.overview.streakCount);
      } catch {
        // dashboard sidebar just shows 0 if this fails — not worth surfacing an error for
      }
    };
    fetchStreak();
  }, []);

  return (
    <Routes>
      <Route path={APP_ROUTES.LOGIN} element={<AuthConsole />} />
      <Route path={APP_ROUTES.REGISTER} element={<Navigate to={APP_ROUTES.LOGIN} replace />} />

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

      <Route
        path={APP_ROUTES.ARENA_GATEKEEPER}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">EXECUTION_ARENA</h1>
                  <p className="text-xs text-[#8a8a93]">YOUR DAILY SESSION BEGINS WITH THE ALGORITHMIC ROUND, FOLLOWED BY THE TECHNICAL ROUND.</p>
                </div>
                <div className="bg-[#121215] border-2 border-[#26262b] p-6 shadow-brutal">
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    There's no separate selection step — starting your session below will walk you through DSA, then automatically into the Technical round.
                  </p>
                  <a
                    href={APP_ROUTES.ARENA_DSA}
                    className="inline-block border border-[#00ff66] text-[#00ff66] font-mono font-black text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-[#00ff66] hover:text-black transition-colors"
                  >
                    [ ENTER TODAY'S SESSION ]
                  </a>
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
              <SessionGate />
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      <Route
        path={APP_ROUTES.ARENA_TECHNICAL}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <SessionGate />
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      <Route
        path={APP_ROUTES.SYNC_LAUNCHPAD}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <SyncLaunchpadPage />
            </DashboardLayout>
          </GuardedRoute>
        }
      />
      
      <Route
        path={APP_ROUTES.SETTINGS}
        element={
          <GuardedRoute>
            <DashboardLayout streakCount={streak} onLogout={executeLogout}>
              <SettingsPanel />
            </DashboardLayout>
          </GuardedRoute>
        }
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};