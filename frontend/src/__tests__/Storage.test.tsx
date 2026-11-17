import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadUserProfile,
  saveUserProfile,
  deleteUserProfile,
  loadTodayChecklist,
  saveTodayChecklist,
  SEEDED_DEMO_PROFILE,
} from '../lib/storage';

describe('LocalStorage Management and Validation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default seeded profile when storage is empty', () => {
    const profile = loadUserProfile();
    expect(profile.user_name).toBe('Mukul');
    expect(profile.members.length).toBe(3);
  });

  it('saves and loads profile changes', () => {
    const custom = {
      ...SEEDED_DEMO_PROFILE,
      user_name: 'Priya',
      location: {
        name: 'Indiranagar, Bengaluru',
        state: 'Karnataka',
        latitude: 12.9784,
        longitude: 77.6408,
      },
    };
    saveUserProfile(custom);
    const loaded = loadUserProfile();
    expect(loaded.user_name).toBe('Priya');
    expect(loaded.location.name).toBe('Indiranagar, Bengaluru');
  });

  it('deletes user profile and clears all data on reset', () => {
    saveUserProfile(SEEDED_DEMO_PROFILE);
    saveTodayChecklist({ act_mask: true });

    deleteUserProfile();
    const loaded = loadUserProfile();
    expect(loaded.user_name).toBe('Mukul');
  });

  it('saves and loads daily checklist state', () => {
    const state = { act_mask: true, act_purifier: true };
    saveTodayChecklist(state, '2026-11-17');
    const loaded = loadTodayChecklist('2026-11-17');
    expect(loaded.act_mask).toBe(true);
    expect(loaded.act_purifier).toBe(true);
  });
});
