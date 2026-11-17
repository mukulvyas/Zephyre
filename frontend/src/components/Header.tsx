import React from 'react';
import { Logo } from './Logo';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onLanguageChange: (lang: string) => void;
  onOpenSettings?: () => void;
  isOfflineMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 pt-safe bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all">
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        {/* Left: Brand Vector Logo */}
        <Logo size="md" />

        {/* Right: Notifications & Profile Avatar */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
            aria-label="User profile settings"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
