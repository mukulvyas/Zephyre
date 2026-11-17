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
    colorHex: '#006c49',
    badgeBg: 'bg-secondary-container',
    badgeText: 'text-on-secondary-container',
    cardGlow: 'bg-secondary-fixed/40',
    trackColor: 'text-secondary',
    cpcbLabel: 'Good, pure clean air',
    dashOffset: 372,
  },
  Satisfactory: {
    category: 'Satisfactory',
    colorHex: '#4edea3',
    badgeBg: 'bg-secondary-fixed',
    badgeText: 'text-on-secondary-fixed',
    cardGlow: 'bg-secondary-fixed-dim/30',
    trackColor: 'text-secondary-fixed-dim',
    cpcbLabel: 'Satisfactory, safe outdoors',
    dashOffset: 331,
  },
  Moderate: {
    category: 'Moderate',
    colorHex: '#cc4900',
    badgeBg: 'bg-tertiary-fixed',
    badgeText: 'text-on-tertiary-fixed',
    cardGlow: 'bg-tertiary-fixed/30',
    trackColor: 'text-tertiary-container',
    cpcbLabel: 'Moderate, take easy breaks',
    dashOffset: 248,
  },
  Poor: {
    category: 'Poor',
    colorHex: '#a33900',
    badgeBg: 'bg-tertiary-fixed',
    badgeText: 'text-on-tertiary-fixed',
    cardGlow: 'bg-tertiary-fixed-dim/40',
    trackColor: 'text-tertiary',
    cpcbLabel: 'Poor, wear N95 in transit',
    dashOffset: 165,
  },
  'Very Poor': {
    category: 'Very Poor',
    colorHex: '#ba1a1a',
    badgeBg: 'bg-error-container',
    badgeText: 'text-on-error-container',
    cardGlow: 'bg-error-container/40',
    trackColor: 'text-error',
    cpcbLabel: 'Very Poor, stay smart today',
    dashOffset: 95,
  },
  Severe: {
    category: 'Severe',
    colorHex: '#93000a',
    badgeBg: 'bg-error-container',
    badgeText: 'text-on-error-container',
    cardGlow: 'bg-error/40',
    trackColor: 'text-error',
    cpcbLabel: 'Severe Emergency, seal indoors',
    dashOffset: 20,
  },
};

export function getAqiTheme(category: AqiCategory): AqiTheme {
  return AQI_THEMES[category] || AQI_THEMES['Very Poor'];
}
