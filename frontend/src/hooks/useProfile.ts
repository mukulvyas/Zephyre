import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { loadUserProfile, saveUserProfile, deleteUserProfile } from '../lib/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);

  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((updater: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => {
    setProfile((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    deleteUserProfile();
    setProfile(loadUserProfile());
  }, []);

  return {
    profile,
    updateProfile,
    resetProfile,
  };
}
