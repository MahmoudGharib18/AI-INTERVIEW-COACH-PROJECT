import React from 'react';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen relative selection:bg-cyber-neonGreen selection:text-black selection:font-bold">
      <AppRoutes />
    </div>
  );
};

export default App;