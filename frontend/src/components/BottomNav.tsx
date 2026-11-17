import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wind, MessageSquare, Sparkles, Users } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const tabs = [
    { to: '/', label: 'Today', icon: Wind },
    { to: '/ask', label: 'Ask', icon: MessageSquare },
    { to: '/impact', label: 'Impact', icon: Sparkles },
    { to: '/family', label: 'My Family', icon: Users },
  ];

  return (
    <nav
      className={`fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(11,28,48,0.06)] border-t border-outline-variant/20 md:hidden ${className}`}
      aria-label="Bottom Navigation"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[11px] font-semibold tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
