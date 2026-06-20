import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AuthConsole } from '../features/auth/components/AuthConsole';
import { MetricGrid } from '../features/dashboard/components/MetricGrid';
import { ArenaHUD } from '../features/interview/components/ArenaHUD';
import { GithubSync } from '../features/sync-launchpad/components/GithubSync';
import { GuardedRoute } from './GuardedRoute';
import { DSAArena } from '../features/interview/components/DSAArena';
import { TechnicalTransition } from '../features/interview/components/TechnicalTransition';
import { TechnicalArena } from '../features/interview/components/TechnicalArena';
import { GithubSync } from '../features/sync-launchpad/components/GithubSync';
import { MetricGrid } from '../features/dashboard/components/MetricGrid';

















export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portal Space */}
        <Route path="/login" element={<AuthConsole isRegister={false} />} />
        <Route path="/register" element={<AuthConsole isRegister={true} />} />
        <Route path="arena/dsa" element={<DSAArena />} />
        <Route path="arena/technical-transition" element={<TechnicalTransition />} />
        <Route path="arena/technical" element={<TechnicalArena />} />


        {/* Guarded Operational Sub-spaces */}
        <Route path="/" element={<GuardedRoute />}>
          <Route path="dashboard" element={
            <DashboardLayout streakCount={0}>
              <MetricGrid />
            </DashboardLayout>
          } />
          <Route path="arena/gatekeeper" element={
            <DashboardLayout streakCount={0}>
              <ArenaHUD />
            </DashboardLayout>
          } />
          <Route path="workspace/sync" element={
            <DashboardLayout streakCount={0}>
              <GithubSync />
            </DashboardLayout>
          } />
          <Route path="workspace/sync" element={
            <DashboardLayout streakCount={0}>
              <GithubSync />
            </DashboardLayout>
          } />
          <Route path="dashboard" element={
            <DashboardLayout streakCount={0}>
              <MetricGrid />
            </DashboardLayout>
          } />
        </Route>

        {/* Catchall Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};