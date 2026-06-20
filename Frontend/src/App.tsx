import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="w-full h-screen relative selection:bg-cyber-neonGreen selection:text-black selection:font-bold">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;