import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Today } from '../pages/Today';
import { SEEDED_DEMO_PROFILE } from '../lib/storage';

// Mock client api
vi.mock('../api/client', () => ({
  getDailyAdvice: vi.fn().mockResolvedValue({
    greeting: 'Good morning, Mukul.',
    one_line_instruction: 'Keep windows sealed and bundle up with an N95 when stepping out.',
    aqi_reading: {
      aqi: 384,
      category: 'Very Poor',
      pm25: 290,
      pm10: 380,
      humidity: 68,
      temperature: 16.5,
      dominant_pollutant: 'PM2.5',
      station_name: 'Greater Kailash II, New Delhi',
      is_modelled: false,
      source: 'cpcb_live',
      data_freshness_text: '12m ago',
    },
    safe_window: {
      start_time: '2:00 PM',
      end_time: '4:00 PM',
      average_aqi: 260,
      category: 'Poor',
      reason: 'AQI dips to 260 with sunlight dispersal. Quick errands are best done here.',
    },
    family_guidance: [
      {
        member_id: 'm1',
        member_name: 'Mukul',
        relationship: 'Self',
        age: 34,
        risk_score: 55,
        verdict: 'be_careful',
        verdict_label: 'N95 for transit',
        badge_color: 'primary',
        icon: 'masks',
        reasons: ['Transit exposure'],
        action_directive: 'Take Yellow line metro.',
      },
    ],
    checklist: [
      {
        id: 'act_mask',
        title: 'Wear N95 Mask outside',
        category: 'outdoor',
        icon_emoji: '😷',
        is_completed: false,
        impact_statement: 'Filters 95%+ of PM2.5.',
      },
    ],
    household_clean_score: 88,
    lifestyle_banner: "You've got this handled.",
    is_offline_mode: false,
    region_summary: 'Keep windows sealed until afternoon.',
  }),
}));

describe('Today Screen Component', () => {
  it('renders greeting, CPCB AQI and locality name', async () => {
    render(
      <BrowserRouter>
        <Today profile={SEEDED_DEMO_PROFILE} />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Good morning, Mukul/i)).toBeInTheDocument();
    expect(screen.getByText('384')).toBeInTheDocument();
    expect(screen.getByText(/Greater Kailash II, New Delhi/i)).toBeInTheDocument();
  });

  it('renders safest outdoor window forecast', async () => {
    render(
      <BrowserRouter>
        <Today profile={SEEDED_DEMO_PROFILE} />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Safest window: 2:00 PM – 4:00 PM/i)).toBeInTheDocument();
  });

  it('toggles checklist items when clicked', async () => {
    render(
      <BrowserRouter>
        <Today profile={SEEDED_DEMO_PROFILE} />
      </BrowserRouter>
    );

    const checklistItem = await screen.findByText(/Wear N95 Mask outside/i);
    expect(checklistItem).toBeInTheDocument();

    fireEvent.click(checklistItem);
    expect(checklistItem).toBeInTheDocument();
  });
});
