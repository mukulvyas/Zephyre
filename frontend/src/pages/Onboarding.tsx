import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, CommuteMode, CookingFuel } from '../types';
import { Logo } from '../components/Logo';
import { searchLocations } from '../api/client';
import { MapPin, Navigation, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  profile: UserProfile;
  onComplete: (updated: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ profile, onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; state: string; latitude: number; longitude: number; display_name: string }>>([]);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const res = await searchLocations(val);
      setSearchResults(res);
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (loc: { name: string; state: string; latitude: number; longitude: number }) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        name: loc.name,
        state: loc.state,
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
    }));
    setSearchQuery(loc.name);
    setSearchResults([]);
  };

  const handleFinish = () => {
    const finalized = { ...formData, isOnboarded: true };
    onComplete(finalized);
    navigate('/');
  };

  const popularChips = [
    { name: 'Greater Kailash II, New Delhi', state: 'Delhi', latitude: 28.5355, longitude: 77.241, label: 'South Delhi' },
    { name: 'Noida Sector 62', state: 'Uttar Pradesh', latitude: 28.628, longitude: 77.3649, label: 'Noida' },
    { name: 'Cyber City, Gurugram', state: 'Haryana', latitude: 28.4949, longitude: 77.0895, label: 'Gurugram' },
    { name: 'Indiranagar, Bengaluru', state: 'Karnataka', latitude: 12.9784, longitude: 77.6408, label: 'Bengaluru' },
    { name: 'Bandra West, Mumbai', state: 'Maharashtra', latitude: 19.0596, longitude: 72.8295, label: 'Mumbai' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Header with Stitch Logo & Step Tracker */}
      <div className="flex flex-col items-center text-center pt-2">
        <Logo size="lg" className="mb-2" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider mb-2">
          Breath of Fresh Air
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          {step === 1 && 'Your Neighborhood'}
          {step === 2 && 'Who Lives With You?'}
          {step === 3 && 'Daily Commute Habits'}
          {step === 4 && 'Home & Kitchen Setup'}
          {step === 5 && 'Your Clean-Air Plan is Ready!'}
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-xs mt-1">
          {step === 1 && 'Calibrated to local sensor microclimates and winter wind patterns.'}
          {step === 2 && 'Personalized shields for children, seniors, and sensitive airways.'}
          {step === 3 && 'Tailor your route to reduce roadway particulate exposure.'}
          {step === 4 && 'Turn your living space into a restorative clean sanctuary.'}
          {step === 5 && 'Built from Indian CPCB ground-truth standards and your profile.'}
        </p>

        {/* Stepper Dots (4 steps) */}
        {step <= 4 && (
          <div className="flex items-center gap-2 mt-4" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-secondary' : 'w-2 bg-surface-container-highest'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Focus Card Container */}
      <div className="my-6">
        {/* STEP 1: Location Setup */}
        {step === 1 && (
          <section className="bg-surface-container-lowest rounded-24 p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Where are you based?</h2>
                  <p className="text-xs text-on-surface-variant">Live station & satellite precision</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                Step 1
              </span>
            </div>

            {/* GPS Button */}
            <button
              type="button"
              onClick={() => {
                selectLocation({
                  name: 'Greater Kailash II, New Delhi',
                  state: 'Delhi',
                  latitude: 28.5355,
                  longitude: 77.241,
                });
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-24 bg-primary text-on-primary font-bold text-sm shadow-sm hover:bg-primary-container transition active:scale-98"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Use Current Location (Delhi NCR)</span>
            </button>

            {/* Search Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="locality-search" className="text-xs font-semibold text-on-surface-variant">
                Or search your locality or city across India
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 absolute left-3.5 text-primary" />
                <input
                  id="locality-search"
                  type="text"
                  value={searchQuery || formData.location.name}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru or Bandra, Mumbai"
                  className="w-full h-12 pl-10 pr-4 rounded-24 bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition"
                />
              </div>

              {/* Search dropdown results */}
              {searchResults.length > 0 && (
                <div className="mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-lg max-h-48 overflow-y-auto z-20">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectLocation(res)}
                      className="w-full text-left px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition border-b border-outline-variant/10 last:border-none"
                    >
                      <span className="font-bold">{res.name}</span>, {res.state}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Area Chips */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Popular Cities
              </span>
              <div className="flex flex-wrap gap-2">
                {popularChips.map((chip, i) => {
                  const isSelected = formData.location.name === chip.name;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectLocation(chip)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                        isSelected
                          ? 'bg-primary-fixed text-on-primary-fixed ring-2 ring-primary/40'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy note */}
            <div className="text-[11px] text-on-surface-variant bg-surface-container-low/70 p-3 rounded-2xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>Your profile and location stay strictly in your browser's local storage.</span>
            </div>
          </section>
        )}

        {/* STEP 2: Family Setup */}
        {step === 2 && (
          <section className="bg-surface-container-lowest rounded-24 p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Family Profiles</h2>
                  <p className="text-xs text-on-surface-variant">Kids, seniors, and asthma sensitivities</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                Step 2
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {formData.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {member.age <= 10 ? '👦🏽' : member.age >= 60 ? '👵🏽' : '👨🏽'}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-on-surface block">{member.name}</span>
                      <span className="text-xs text-on-surface-variant">
                        {member.age} yrs • {member.relationship}
                      </span>
                    </div>
                  </div>
                  {member.has_asthma_or_respiratory && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                      Asthma
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Default demo persona loaded (Mukul, Aarav 6, Kavita 68 with mild asthma). You can edit member ages or add new members later in the My Family tab.
            </p>
          </section>
        )}

        {/* STEP 3: Commute Mode */}
        {step === 3 && (
          <section className="bg-surface-container-lowest rounded-24 p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">How do you commute?</h2>
                  <p className="text-xs text-on-surface-variant">Select your primary daily transit mode</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                Step 3
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'metro', label: 'Metro Rail', emoji: '🚇' },
                { id: 'bus', label: 'City Bus', emoji: '🚌' },
                { id: 'car_ac', label: 'Car (AC Closed)', emoji: '🚗' },
                { id: 'two_wheeler', label: 'Two Wheeler', emoji: '🛵' },
                { id: 'walk_cycle', label: 'Walk / Bicycle', emoji: '🚲' },
                { id: 'wfh', label: 'Work From Home', emoji: '💻' },
              ].map((opt) => {
                const isSelected = formData.members[0].commute_mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        const updated = [...prev.members];
                        updated[0].commute_mode = opt.id as CommuteMode;
                        return { ...prev, members: updated };
                      });
                    }}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-center transition active:scale-95 ${
                      isSelected
                        ? 'bg-primary-fixed border-primary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 4: Home & Kitchen Setup */}
        {step === 4 && (
          <section className="bg-surface-container-lowest rounded-24 p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Home Sanctuary Setup</h2>
                  <p className="text-xs text-on-surface-variant">Purifiers, cooking fuel & ventilation</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                Step 4
              </span>
            </div>

            {/* Purifier Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">Do you have an Air Purifier?</span>
                <span className="text-xs text-on-surface-variant">HEPA filter in bedroom/living room</span>
              </div>
              <input
                type="checkbox"
                checked={formData.household.has_air_purifier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    household: { ...prev.household, has_air_purifier: e.target.checked },
                  }))
                }
                className="w-5 h-5 accent-secondary cursor-pointer"
              />
            </div>

            {/* Cooking Fuel Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Cooking Fuel</label>
              <select
                value={formData.household.cooking_fuel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    household: { ...prev.household, cooking_fuel: e.target.value as CookingFuel },
                  }))
                }
                className="w-full h-11 px-3 rounded-2xl bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary"
              >
                <option value="lpg">LPG Cylinder (Clean cooking)</option>
                <option value="png">Piped Natural Gas (PNG)</option>
                <option value="electric_induction">Electric Induction / Microwave</option>
                <option value="biomass_wood">Biomass / Firewood Chulha</option>
              </select>
            </div>
          </section>
        )}

        {/* STEP 5: Ready Plan */}
        {step === 5 && (
          <section className="bg-surface-container-lowest rounded-24 p-6 sm:p-8 shadow-md border border-outline-variant/30 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary text-3xl shadow-xs">
              🌿
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-extrabold text-secondary tracking-widest">
                Sanctuary Calibrated
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface mt-1">
                Your Clean-Air Plan is Ready
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xs leading-relaxed">
                Calibrated for {formData.location.name}. Personalized for Mukul, Aarav, and Kavita.
              </p>
            </div>

            <div className="w-full p-4 rounded-2xl bg-surface-container-low text-left border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                <span>CPCB Air Quality Breakpoint Engine active</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                <span>Hourly safest outdoor window forecasting active</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                <span>Deterministic explainable emission factors ready</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 rounded-24 bg-primary text-on-primary font-bold text-base shadow-md hover:bg-primary-container transition active:scale-98 mt-2"
            >
              Open My Daily Coach →
            </button>
          </section>
        )}
      </div>

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 rounded-full bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-sm hover:bg-primary-container transition active:scale-98"
          >
            <span>{step === 4 ? 'Review Clean Plan' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
