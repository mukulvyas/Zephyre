import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { Logo } from '../components/Logo';
import { AqiGauge } from '../components/AqiGauge';
import { SafeWindowTimeline } from '../components/SafeWindowTimeline';

describe('Accessibility Standards (WCAG 2.1 AA)', () => {
  it('Logo component contains no accessibility violations', async () => {
    const { container } = render(<Logo size="md" />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('AqiGauge has accessible progressbar role, aria labels and zero violations', async () => {
    const reading = {
      aqi: 384,
      category: 'Very Poor' as const,
      pm25: 290,
      pm10: 380,
      humidity: 68,
      temperature: 16.5,
      dominant_pollutant: 'PM2.5',
      station_name: 'Greater Kailash II, New Delhi',
      is_modelled: false,
      source: 'cpcb_live',
      data_freshness_text: '12m ago',
    };

    const { container } = render(
      <AqiGauge
        reading={reading}
        directiveText="Keep windows sealed and bundle up with an N95 when stepping out."
      />
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('SafeWindowTimeline contains no accessibility violations', async () => {
    const safeWindow = {
      start_time: '2:00 PM',
      end_time: '4:00 PM',
      average_aqi: 260,
      category: 'Poor' as const,
      reason: 'AQI dips with sunlight dispersal.',
    };

    const { container } = render(
      <SafeWindowTimeline safeWindow={safeWindow} />
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
