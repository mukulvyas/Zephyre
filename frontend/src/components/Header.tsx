import React from 'react';
import { Logo } from './Logo';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onLanguageChange: (lang: string) => void;
  onOpenSettings?: () => void;
  isOfflineMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onLanguageChange,
  onOpenSettings,
  isOfflineMode = false,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand Vector Logo */}
        <Logo size="md" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Offline Mode Indicator Tag */}
          {isOfflineMode && (
            <span
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold border border-outline-variant/30"
              title="Running on built-in deterministic rule engine"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Offline Coach Mode
            </span>
          )}

          {/* Language Selector */}
          <div className="relative">
            <label htmlFor="language-select" className="sr-only">
              Choose language
            </label>
            <select
              id="language-select"
              value={profile.language || 'en'}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold py-1.5 pl-3 pr-7 rounded-full border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition"
              aria-label="Interface Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px]">
              ▼
            </span>
          </div>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-fixed text-primary font-bold text-sm ring-2 ring-primary-fixed hover:opacity-90 transition active:scale-95"
            aria-label="User profile settings"
          >
            {profile.user_name ? profile.user_name.charAt(0).toUpperCase() : 'M'}
          </button>
        </div>
      </div>
    </header>
  );
};
