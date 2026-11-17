import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Ask } from '../pages/Ask';
import { SEEDED_DEMO_PROFILE } from '../lib/storage';
import * as client from '../api/client';

describe('Ask AI Coach Screen', () => {
  it('renders quick question chips and initial conversation messages', () => {
    render(
      <BrowserRouter>
        <Ask profile={SEEDED_DEMO_PROFILE} />
      </BrowserRouter>
    );

    expect(screen.getByText('Zephyre Breeze AI')).toBeInTheDocument();
    expect(screen.getByText(/Can my kid play outside\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Can Aarav \(6 yrs old, son\) go to outdoor football coaching/i)
    ).toBeInTheDocument();
  });

  it('submits a free-text question and renders the verdict response card', async () => {
    const askSpy = vi.spyOn(client, 'askCoach').mockResolvedValueOnce({
      verdict: 'avoid',
      verdict_label: 'Avoid Outdoor Play',
      reason: 'AQI is in the Very Poor category. Particulates irritate airways.',
      suggestion: 'Play indoor board games or living room yoga.',
      impact: 'Choice -> Effect -> Number: Cuts particulate intake by 70%.',
      safer_time: '2:00 PM – 4:00 PM',
      needs_doctor: false,
      language: 'en',
      is_offline_fallback: false,
    });

    render(
      <BrowserRouter>
        <Ask profile={SEEDED_DEMO_PROFILE} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Ask about today's air|Ask about outdoor/i);
    fireEvent.change(input, { target: { value: 'Can we go for a run at 7 PM?' } });

    const submitBtn = screen.getByRole('button', { name: /Send message/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(askSpy).toHaveBeenCalledWith(
        'Can we go for a run at 7 PM?',
        'en',
        expect.anything()
      );
    });

    expect(await screen.findByText('Avoid Outdoor Play')).toBeInTheDocument();
    expect(screen.getByText(/Play indoor board games/i)).toBeInTheDocument();
  });
});
