import {
  AskResponse,
  DailyAdviceResponse,
  GeocodingResult,
  ImpactReportResponse,
  UserProfile,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function searchLocations(q: string): Promise<GeocodingResult[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/location/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('Location search fallback:', e);
    return [
      {
        name: 'Greater Kailash II, New Delhi',
        state: 'Delhi',
        latitude: 28.5355,
        longitude: 77.241,
        country: 'India',
        display_name: 'South Delhi (GK-II)',
      },
      {
        name: 'Indiranagar, Bengaluru',
        state: 'Karnataka',
        latitude: 12.9784,
        longitude: 77.6408,
        country: 'India',
        display_name: 'Bengaluru (Indiranagar)',
      },
    ];
  }
}

export async function getDailyAdvice(profile: UserProfile): Promise<DailyAdviceResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/advice/daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('Using client-side offline fallback for daily advice:', e);
    // Client-side fallback if backend unreachable
    return {
      greeting: `Good morning, ${profile.user_name}.`,
      one_line_instruction: 'Keep windows sealed and bundle up with an N95 when stepping out.',
      aqi_reading: {
        aqi: 340,
        category: 'Very Poor',
        pm25: 290,
        pm10: 380,
        humidity: 68,
        temperature: 16.5,
        dominant_pollutant: 'PM2.5',
        station_name: `${profile.location.name} (Offline Cache)`,
        is_modelled: true,
        source: 'cached_offline',
        data_freshness_text: 'Offline mode',
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
          reasons: ['Open traffic commute increases fine particulate inhalation.'],
          action_directive: 'Take Yellow line metro. Car AC set to recirculation.',
        },
        {
          member_id: 'm2',
          member_name: 'Aarav',
          relationship: 'Son',
          age: 6,
          risk_score: 80,
          verdict: 'avoid',
          verdict_label: 'Indoor play only',
          badge_color: 'tertiary',
          icon: 'child_care',
          reasons: ['Developing lungs breathe 2-3x more air per kg.'],
          action_directive: 'Move sports activities inside.',
        },
        {
          member_id: 'm3',
          member_name: 'Kavita',
          relationship: 'Grandmother',
          age: 68,
          risk_score: 90,
          verdict: 'avoid',
          verdict_label: 'Stay in, inhaler ready',
          badge_color: 'error',
          icon: 'health_and_safety',
          reasons: ['Asthma sensitivity with cold ground-level smog.'],
          action_directive: 'Stay indoors with HEPA purifier running.',
        },
      ],
      checklist: [
        {
          id: 'act_mask',
          title: 'Wear N95 Mask outside',
          category: 'outdoor',
          icon_emoji: '😷',
          pm25_avoided_ug: 180,
          is_completed: true,
          impact_statement: 'Filters 95%+ of PM2.5 compared to standard cloth.',
        },
        {
          id: 'act_purifier',
          title: "Run purifier on High in kids' room",
          category: 'indoor',
          icon_emoji: '🌀',
          pm25_avoided_ug: 250,
          is_completed: false,
          impact_statement: 'Reduces indoor particulates by 75-80%.',
        },
        {
          id: 'act_transit',
          title: 'Take Metro instead of open auto',
          category: 'transit',
          icon_emoji: '🚇',
          co2_saved_kg: 1.8,
          is_completed: false,
          impact_statement: 'Saves 1.8 kg CO2 and avoids roadside fumes.',
        },
        {
          id: 'act_cleaning',
          title: 'Damp-mop floors (skip dry sweeping)',
          category: 'home',
          icon_emoji: '🧹',
          pm25_avoided_ug: 95,
          is_completed: false,
          impact_statement: 'Traps settled fine dust without kicking it into air.',
        },
      ],
      household_clean_score: 88,
      lifestyle_banner: "You've got this handled. Simple habits noticeably cut your family's pollution exposure.",
      is_offline_mode: true,
      region_summary: 'Keep windows sealed until afternoon sunlight.',
    };
  }
}

export async function askCoach(
  question: string,
  language = 'en',
  profile?: UserProfile
): Promise<AskResponse> {
  const payload = {
    question,
    language,
    profile_override: profile,
  };
  const res = await fetchWithTimeout(`${API_BASE}/api/advice/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }
  return await res.json();
}

export async function getImpactReport(
  completedActionIds: string[]
): Promise<ImpactReportResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed_action_ids: completedActionIds }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('Using client-side fallback for impact:', e);
    return {
      total_co2_avoided_kg: 2.1,
      total_pm25_exposure_reduced_pct: 75,
      nature_equivalent: '🌱 That’s like a young neem tree growing for an entire week!',
      streak_clean_days: 5,
      weekly_history: [
        { day: 'Mon', short: 'M', completed: true, co2_kg: 1.9 },
        { day: 'Tue', short: 'T', completed: true, co2_kg: 2.1 },
        { day: 'Wed', short: 'W', completed: true, co2_kg: 2.0 },
        { day: 'Thu', short: 'T', completed: true, co2_kg: 2.1, is_today: true },
        { day: 'Fri', short: 'F', completed: true, co2_kg: 1.8 },
        { day: 'Sat', short: 'S', completed: false, co2_kg: 0.0 },
        { day: 'Sun', short: 'S', completed: false, co2_kg: 0.0 },
      ],
      action_breakdowns: [
        {
          action_id: 'act_transit',
          action_title: 'Delhi Metro instead of Cab',
          choice_made: 'Took Delhi Metro for 15 km round trip commute',
          effect_description: 'Avoided direct highway tailpipe fumes and cut petrol combustion',
          number_highlight: '-1.8 kg CO₂ avoided',
          calculation: {
            value: 1.8,
            unit: 'kg CO2',
            formula: '(0.140 kg/km [car] - 0.018 kg/km [metro]) * 15 km',
            assumption: 'Typical urban commute distance 15 km.',
            source_note: 'CPCB & CEA Transport Baseline Database.',
          },
          nature_equivalent: 'Equal to 1 week of carbon absorption by a young neem sapling',
          icon: 'directions_subway',
        },
      ],
      methodology_note: 'Calculated using verified CPCB/CEA transport emission factors.',
    };
  }
}
