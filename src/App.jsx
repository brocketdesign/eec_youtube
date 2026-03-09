import { Routes, Route } from 'react-router-dom';
import './App.css';

// New EEC Platform pages
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import SetupProgressPage from './pages/SetupProgressPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// Legacy pages (keep for SEO)
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePage from './pages/CookiePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/setup-progress" element={<SetupProgressPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Legal */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiePage />} />
    </Routes>
  );
}

export default App;
