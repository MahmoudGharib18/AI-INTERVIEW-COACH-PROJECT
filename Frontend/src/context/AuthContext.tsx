import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Pulling progress overview acts as our token verification check
      const response: any = await api.get('/progress/overview');
      if (response && response.success === false) {
        setUser(null);
      } else {
        // Fallback user initialization if cookie is active but profile needs hydration
        const storedUser = window.localStorage.getItem('orchestrator_user_meta');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no stored profile metadata exists but session is authenticated
          setUser({
            id: 'hydrated_session',
            name: 'Operator',
            email: '',
            preferredInterviewTime: '09:00'
          });
        }
      }
    } catch (err) {
      setUser(null);
      window.localStorage.removeItem('orchestrator_user_meta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be executed within an explicit AuthProvider wrapper boundaries.');
  }
  return context;
};