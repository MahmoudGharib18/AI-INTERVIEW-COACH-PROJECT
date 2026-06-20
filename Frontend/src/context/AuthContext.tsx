import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  preferredInterviewTime: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: Record<string, string>) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll for an active session on boot up
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const response = await api.get('/sessions/active');
        // Your /sessions/active endpoint schema structure
        if (response.data && response.data.session) {
          setUser(response.data.session.user || null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkActiveSession();
  }, []);

  const login = async (credentials: Record<string, string>) => {
    const res = await api.post('/auth/login', credentials);
    setUser(res.data.user);
  };

  const register = async (data: Record<string, string>) => {
    const res = await api.post('/auth/register', data);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be executed within an AuthProvider');
  return context;
};