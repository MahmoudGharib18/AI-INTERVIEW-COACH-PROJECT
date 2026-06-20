import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';

interface AuthConsoleProps {
  isRegister?: boolean;
}

export const AuthConsole: React.FC<AuthConsoleProps> = ({ isRegister: initialIsRegister = false }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', preferredInterviewTime: '09:00' });
  const [systemError, setSystemError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (systemError) setSystemError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    setSystemError(null);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({ email: formData.email, password: formData.password });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setSystemError(err.message || 'ACCESS_DENIED: Operational failure.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-4 scanlines">
      <div className="w-full max-w-md bg-cyber-surface border-2 border-cyber-border p-6 shadow-brutal relative">
        
        {/* Terminal Header Telemetry */}
        <div className="flex items-center justify-between border-b-2 border-cyber-border pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-cyber-neonOrange rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white">
              {isRegister ? 'SYS//SECURE_SIGNUP' : 'SYS//SECURE_AUTH'}
            </span>
          </div>
          <span className="text-[10px] text-cyber-textMuted font-mono">NODE_V1.0</span>
        </div>

        {systemError && (
          <div className="bg-transparent border border-cyber-neonRed text-cyber-neonRed text-xs p-3 font-mono mb-4 rounded uppercase tracking-wider animate-shake">
            ⚠️ CRITICAL_ERR // {systemError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] text-cyber-textMuted font-bold mb-1 tracking-wider">CANDIDATE_NAME</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-cyber-bg border-2 border-cyber-border p-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyber-neonGreen transition-colors"
                placeholder="Mahmoud"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] text-cyber-textMuted font-bold mb-1 tracking-wider">SECURE_EMAIL</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-cyber-bg border-2 border-cyber-border p-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyber-neonGreen transition-colors"
              placeholder="operator@domain.com"
            />
          </div>

          <div>
            <label className="block text-[11px] text-cyber-textMuted font-bold mb-1 tracking-wider">CIPHER_PASSWORD</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-cyber-bg border-2 border-cyber-border p-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyber-neonGreen transition-colors"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] text-cyber-textMuted font-bold mb-1 tracking-wider">ORCHESTRATION_TIME (HH:MM)</label>
              <input
                type="text"
                name="preferredInterviewTime"
                required
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                value={formData.preferredInterviewTime}
                onChange={handleInputChange}
                className="w-full bg-cyber-bg border-2 border-cyber-border p-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyber-neonGreen transition-colors"
                placeholder="09:00"
              />
            </div>
          )}

          <Button type="submit" variant={isRegister ? "orange" : "neon"} className="w-full mt-2" disabled={working}>
            {working ? 'PROCESSING...' : isRegister ? 'INITIALIZE_ACCOUNT' : 'EXECUTE_LOGIN'}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-cyber-border pt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setSystemError(null);
            }}
            className="text-xs text-cyber-textMuted hover:text-white transition-colors underline underline-offset-4 decoration-cyber-border font-mono"
          >
            {isRegister ? '← SWITCH TO EXISTING OPERATOR LOGIN' : 'CREATE NEW OPERATIONS ACCOUNT →'}
          </button>
        </div>

      </div>
    </div>
  );
};