import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wind, MessageSquare, Sparkles, Users, Trash2 } from 'lucide-react';

interface SidebarProps {
  onResetData: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onResetData, className = '' }) => {
  const navItems = [
    { to: '/', label: 'Today', description: 'Daily Routine & Clean Window', icon: Wind },
    { to: '/ask', label: 'Ask AI Coach', description: 'Ask free-text questions', icon: MessageSquare },
    { to: '/impact', label: 'Impact Tracker', description: 'CO₂ avoided & clean streak', icon: Sparkles },
    { to: '/family', label: 'My Family', description: 'Vulnerability & sanctuary score', icon: Users },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col w-64 lg:w-72 bg-surface-container-lowest border-r border-outline-variant/30 min-h-screen p-6 fixed top-20 left-0 bottom-0 z-30 justify-between ${className}`}
      aria-label="Desktop Sidebar"
    >
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant px-3">
            Navigation
          </span>
          <nav className="flex flex-col gap-1.5 mt-3">
            {navItems.map(({ to, label, description, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-fixed text-primary font-bold shadow-xs'
                      : 'text-on-surface hover:bg-surface-container-low text-on-surface-variant'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-sm font-semibold truncate leading-tight">{label}</span>
                      <span className="text-[11px] text-on-surface-variant truncate opacity-80 mt-0.5">
                        {description}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Data Controls */}
      <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
        <button
          type="button"
          onClick={onResetData}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-error hover:bg-error-container/40 transition active:scale-98"
          title="Clear local profile and start fresh"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset / Delete My Data</span>
        </button>
        <span className="text-[10px] text-on-surface-variant px-3 leading-tight opacity-70">
          Stored only in local storage. Zero analytics.
        </span>
      </div>
    </aside>
  );
};
