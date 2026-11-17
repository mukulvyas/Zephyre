import React from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AppRoutes } from './routes';

const AppContent: React.FC = () => {
  const { profile, updateProfile, resetProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnboarding = location.pathname === '/onboarding';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center text-on-surface font-sans antialiased">
      {/* Mobile-first App Shell matching Google Stitch Designs 1:1 */}
      <div className="w-full max-w-md bg-surface min-h-screen relative shadow-2xl flex flex-col border-x border-outline-variant/15">
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

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 w-full transition-all ${
            isOnboarding ? 'p-0' : 'pt-20 pb-28 px-4'
          }`}
        >
          <AppRoutes
            profile={profile}
            onUpdateProfile={(updated) => updateProfile(updated)}
            onResetData={resetProfile}
          />
        </main>

        {/* Bottom Navigation */}
        {!isOnboarding && <BottomNav />}
      </div>
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
