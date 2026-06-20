import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const GuardedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center scanlines font-mono text-cyber-neonGreen text-sm tracking-widest">
        LOADING_SECURE_METRICS...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};