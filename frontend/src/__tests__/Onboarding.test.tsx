import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Onboarding } from '../pages/Onboarding';
import { SEEDED_DEMO_PROFILE } from '../lib/storage';

describe('Onboarding Flow Component', () => {
  it('renders Step 1 Location with GPS and search input', () => {
    const onComplete = vi.fn();
    render(
      <BrowserRouter>
        <Onboarding profile={SEEDED_DEMO_PROFILE} onComplete={onComplete} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Neighborhood/i)).toBeInTheDocument();
    expect(screen.getByText(/Where are you based\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Current Location/i)).toBeInTheDocument();
  });

  it('navigates through steps when clicking Next Step', () => {
    const onComplete = vi.fn();
    render(
      <BrowserRouter>
        <Onboarding profile={SEEDED_DEMO_PROFILE} onComplete={onComplete} />
      </BrowserRouter>
    );

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    // Step 2
    expect(screen.getByText(/Family Profiles/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    // Step 3
    expect(screen.getByText(/How do you commute\?/i)).toBeInTheDocument();
  });
});
