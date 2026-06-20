import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const GuardedRoute: React.FC = () => {
  // Global auth logic hooks into this context state
  const isAuthenticated = true; // Replace with dynamic verification check status

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};