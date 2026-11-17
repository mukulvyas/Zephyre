import React from 'react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const tabs = [
    { to: '/', label: 'Today', icon: 'air' },
    { to: '/ask', label: 'Ask', icon: 'chat_bubble' },
    { to: '/impact', label: 'Impact', icon: 'eco' },
    { to: '/family', label: 'My Family', icon: 'diversity_1' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(11,28,48,0.06)] border-t border-outline-variant/15 ${className}`}
      aria-label="Bottom Navigation"
    >
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isActive ? 'font-bold' : ''
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}
                >
                  {icon}
                </span>
                <span className={`text-[11px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
