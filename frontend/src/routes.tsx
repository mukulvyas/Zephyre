import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from './types';
import { SkeletonCard } from './components/SkeletonCard';

const Today = lazy(() =>
  import('./pages/Today').then((m) => ({ default: m.Today }))
);
const Ask = lazy(() =>
  import('./pages/Ask').then((m) => ({ default: m.Ask }))
);
const Impact = lazy(() =>
  import('./pages/Impact').then((m) => ({ default: m.Impact }))
);
const Family = lazy(() =>
  import('./pages/Family').then((m) => ({ default: m.Family }))
);
const Onboarding = lazy(() =>
  import('./pages/Onboarding').then((m) => ({ default: m.Onboarding }))
);

interface AppRoutesProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pt-8">
          <SkeletonCard height="h-28" />
          <SkeletonCard height="h-80" />
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            profile.isOnboarded ? (
              <Today profile={profile} />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route path="/ask" element={<Ask profile={profile} />} />
        <Route path="/impact" element={<Impact profile={profile} />} />
        <Route
          path="/family"
          element={<Family profile={profile} onResetData={onResetData} />}
        />
        <Route
          path="/onboarding"
          element={
            <Onboarding
              profile={profile}
              onComplete={(updated) => onUpdateProfile(updated)}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
