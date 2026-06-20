import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScanlineLoader } from '../components/feedback/ScanlineLoader';
import { APP_ROUTES } from '../config/constants';

interface GuardedRouteProps {
  children: React.JSX.Element;
}

export const GuardedRoute: React.FC<GuardedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ScanlineLoader statusMessage="VERIFYING_SECURITY_CONTEXT..." />;
  }

  if (!user) {
    // Evict user to authentication hub panel while saving original target route location path link
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};