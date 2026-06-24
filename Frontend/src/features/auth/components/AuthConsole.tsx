import { Button } from '@/components/ui/Button.tsx';
import { Input } from '@/components/ui/Input.tsx';
import { APP_ROUTES } from '@/config/constants.ts';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions.ts';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


export const AuthConsole: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeLogin, executeRegister, isSubmitting, authError, clearError } = useAuthActions();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredInterviewTime: '09:00'
  });

  // Check state to preserve redirection history
  const destinationTarget = (location.state as any)?.from?.pathname || APP_ROUTES.DASHBOARD;

  const handleInputChange = (field: string, value: string) => {
    if (authError) clearError();
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      const result = await executeLogin({ email: formData.email, password: formData.password });
      if (result.success) navigate(destinationTarget, { replace: true });
    } else {
      const result = await executeRegister(formData);
      if (result.success) navigate(destinationTarget, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 font-mono scanlines">
      <div className="w-full max-w-md bg-[#121215] border-2 border-[#26262b] p-6 shadow-brutal hover:border-[#00ff66] transition-colors duration-500">
        
        {/* Terminal Header */}
        <div className="border-b border-[#26262b] pb-3 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSubmitting ? 'bg-[#ff5500] animate-ping' : 'bg-[#00ff66]'}`} />
            <span className="text-xs font-black text-white tracking-widest uppercase">
              {isLoginMode ? 'SECURE_AUTH_LOGIN' : 'INITIALIZE_OPERATOR'}
            </span>
          </div>
          <span className="text-[9px] text-[#8a8a93] tracking-tight">V1.0.0-SYS</span>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="bg-[#ff0033]/5 border border-[#ff0033] p-3 text-xs text-[#ff0033] mb-4 font-bold tracking-wide uppercase">
            ⚡ FAILURE // {authError}
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="space-y-4">
          {!isLoginMode && (
            <Input
              label="Operator Name"
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Mahmoud"
            />
          )}

          <Input
            label="Security Link Email"
            type="email"
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="mahmoud@domain.com"
          />

          <Input
            label="Cryptographic Password"
            type="password"
            required
            disabled={isSubmitting}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="********"
          />

          {!isLoginMode && (
            <Input
              label="Daily Cron Launch Window (HH:MM)"
              type="text"
              required
              disabled={isSubmitting}
              value={formData.preferredInterviewTime}
              onChange={(e) => handleInputChange('preferredInterviewTime', e.target.value)}
              placeholder="09:00"
            />
          )}

          <Button 
            type="submit" 
            variant={isLoginMode ? 'neon' : 'orange'} 
            className="w-full mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'TRANSMITTING_TELEMETRY...' : isLoginMode ? 'ESTABLISH_SESSION_LINK' : 'PROVISION_CORE_PROFILE'}
          </Button>
        </form>

        {/* Switch Modality Footer */}
        <div className="mt-6 pt-4 border-t border-[#26262b] text-center">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              clearError();
              setIsLoginMode(prev => !prev);
            }}
            className="text-[10px] tracking-widest font-black text-[#8a8a93] hover:text-white uppercase transition-colors"
          >
            {isLoginMode ? '[CREATE NEW OPERATOR KEY]' : '[RETURN TO USER TERMINAL ACCESS]'}
          </button>
        </div>

      </div>
    </div>
  );
};