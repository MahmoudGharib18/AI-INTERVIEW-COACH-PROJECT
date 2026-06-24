import { TourOverlay } from '@/components/feedback/TourOverlay.tsx';
import { AuthProvider } from '@/context/AuthContext.tsx';
import { TourProvider } from '@/context/TourContext.tsx';
import { AppRoutes } from '@/routes/AppRoutes.tsx';
import { BrowserRouter as Router } from 'react-router-dom';


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TourProvider>
          <AppRoutes />
          <TourOverlay />
        </TourProvider>
      </AuthProvider>
    </Router>
  );
}