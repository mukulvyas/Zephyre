import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cloud: {
          50: '#FBFDFD',
          100: '#F3F6F8',
          200: '#E8EDF2',
          300: '#D5DFE8',
          800: '#1E293B',
          900: '#0F172A',
        },
        mint: {
          50: '#F0FDF8',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        skybrand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        peach: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        aqi: {
          good: '#10B981',
          satisfactory: '#84CC16',
          moderate: '#F59E0B',
          poor: '#F97316',
          veryPoor: '#EF4444',
          severe: '#881337',
        },
      },
      borderRadius: {
        '24': '24px',
        card: '24px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
