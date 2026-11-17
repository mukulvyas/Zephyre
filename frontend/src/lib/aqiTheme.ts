import { AqiCategory } from '../types';

export interface AqiTheme {
  category: AqiCategory;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  cardGlow: string;
  trackColor: string;
  cpcbLabel: string;
  dashOffset: number; // for radial circle (circumference = 414)
}

export const AQI_THEMES: Record<AqiCategory, AqiTheme> = {
  Good: {
    category: 'Good',
    colorHex: '#10B981',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    cardGlow: 'bg-emerald-400/20',
    trackColor: 'text-emerald-500',
    cpcbLabel: 'Good, pure clean air',
    dashOffset: 372,
  },
  Satisfactory: {
    category: 'Satisfactory',
    colorHex: '#84CC16',
    badgeBg: 'bg-lime-100 dark:bg-lime-950/40',
    badgeText: 'text-lime-800 dark:text-lime-300',
    cardGlow: 'bg-lime-400/20',
    trackColor: 'text-lime-500',
    cpcbLabel: 'Satisfactory, safe outdoors',
    dashOffset: 331,
  },
  Moderate: {
    category: 'Moderate',
    colorHex: '#F59E0B',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    cardGlow: 'bg-amber-400/20',
    trackColor: 'text-amber-500',
    cpcbLabel: 'Moderate, take easy breaks',
    dashOffset: 248,
  },
  Poor: {
    category: 'Poor',
    colorHex: '#F97316',
    badgeBg: 'bg-orange-100 dark:bg-orange-950/40',
    badgeText: 'text-orange-800 dark:text-orange-300',
    cardGlow: 'bg-orange-400/20',
    trackColor: 'text-orange-500',
    cpcbLabel: 'Poor, wear N95 in transit',
    dashOffset: 165,
  },
  'Very Poor': {
    category: 'Very Poor',
    colorHex: '#EF4444',
    badgeBg: 'bg-error-container',
    badgeText: 'text-on-error-container',
    cardGlow: 'bg-error-container/40',
    trackColor: 'text-error',
    cpcbLabel: 'Very Poor, stay smart today',
    dashOffset: 95,
  },
  Severe: {
    category: 'Severe',
    colorHex: '#881337',
    badgeBg: 'bg-rose-200 dark:bg-rose-950',
    badgeText: 'text-rose-950 dark:text-rose-200',
    cardGlow: 'bg-rose-500/30',
    trackColor: 'text-rose-900',
    cpcbLabel: 'Severe Emergency, seal indoors',
    dashOffset: 20,
  },
};

export function getAqiTheme(category: AqiCategory): AqiTheme {
  return AQI_THEMES[category] || AQI_THEMES['Very Poor'];
}
