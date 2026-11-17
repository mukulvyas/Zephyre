import { UserProfile } from '../types';

const STORAGE_KEY_PROFILE = 'zephyre_user_profile_v1';
const STORAGE_KEY_CHECKLIST_PREFIX = 'zephyre_checklist_';
const STORAGE_KEY_STREAK = 'zephyre_streak_v1';

export const SEEDED_DEMO_PROFILE: UserProfile = {
  user_name: 'Mukul',
  language: 'en',
  location: {
    name: 'Greater Kailash II, New Delhi',
    state: 'Delhi',
    latitude: 28.5355,
    longitude: 77.241,
  },
  members: [
    {
      id: 'm1',
      name: 'Mukul',
      age: 34,
      relationship: 'Self',
      has_asthma_or_respiratory: false,
      commute_mode: 'metro',
      default_activity: 'moderate',
    },
    {
      id: 'm2',
      name: 'Aarav',
      age: 6,
      relationship: 'Son',
      has_asthma_or_respiratory: false,
      commute_mode: 'bus',
      default_activity: 'vigorous',
    },
    {
      id: 'm3',
      name: 'Kavita',
      age: 68,
      relationship: 'Grandmother',
      has_asthma_or_respiratory: true,
      commute_mode: 'wfh',
      default_activity: 'light',
    },
  ],
  household: {
    has_air_purifier: true,
    purifier_count: 2,
    cooking_fuel: 'lpg',
    has_exhaust_chimney: true,
    window_sealing_quality: 'average',
  },
  isOnboarded: true,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return SEEDED_DEMO_PROFILE;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.location && Array.isArray(parsed.members)) {
      return parsed;
    }
    return SEEDED_DEMO_PROFILE;
  } catch {
    return SEEDED_DEMO_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }
}

export function deleteUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    // Clear checklist keys
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_KEY_CHECKLIST_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(STORAGE_KEY_STREAK);
  } catch (e) {
    console.error('Failed to clear local data:', e);
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function loadTodayChecklist(dateStr = getTodayDateString()): Record<string, boolean> {
  try {
    const key = `${STORAGE_KEY_CHECKLIST_PREFIX}${dateStr}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Default to 1 action completed for initial day demo
      return { act_mask: true };
    }
    return JSON.parse(raw);
  } catch {
    return { act_mask: true };
  }
}

export function saveTodayChecklist(
  checkedMap: Record<string, boolean>,
  dateStr = getTodayDateString()
): void {
  try {
    const key = `${STORAGE_KEY_CHECKLIST_PREFIX}${dateStr}`;
    localStorage.setItem(key, JSON.stringify(checkedMap));
  } catch (e) {
    console.error('Failed to save checklist:', e);
  }
}

export function loadStreak(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    return raw ? parseInt(raw, 10) : 5;
  } catch {
    return 5;
  }
}
