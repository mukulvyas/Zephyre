import React from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { AppRoutes } from './routes';

const AppContent: React.FC = () => {
  const { profile, updateProfile, resetProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnboarding = location.pathname === '/onboarding';

  return (
    <div className="min-h-screen bg-cloud-100 dark:bg-cloud-900 text-on-surface antialiased flex flex-col font-sans selection:bg-mint-200">
      {/* Skip to Content Link for WCAG 2.1 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Header (omitted during onboarding for focused wizard) */}
      {!isOnboarding && (
        <Header
          profile={profile}
          onLanguageChange={(lang) => updateProfile({ language: lang })}
          onOpenSettings={() => navigate('/family')}
          isOfflineMode={true}
        />
      )}

      {/* Desktop Sidebar (hidden on mobile, hidden during onboarding) */}
      {!isOnboarding && <Sidebar onResetData={resetProfile} />}

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 w-full transition-all ${
          isOnboarding
            ? 'p-0'
            : 'pt-24 pb-20 md:pb-8 px-4 sm:px-6 md:pl-72 lg:pl-80 max-w-7xl mx-auto'
        }`}
      >
        <AppRoutes
          profile={profile}
          onUpdateProfile={(updated) => updateProfile(updated)}
          onResetData={resetProfile}
        />
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop and during onboarding) */}
      {!isOnboarding && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
