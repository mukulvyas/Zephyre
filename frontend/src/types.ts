export type AqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export type CommuteMode =
  | 'metro'
  | 'bus'
  | 'car_ac'
  | 'car_open'
  | 'two_wheeler'
  | 'walk_cycle'
  | 'wfh';

export type CookingFuel = 'lpg' | 'electric_induction' | 'png' | 'biomass_wood';

export type ActivityIntensity = 'light' | 'moderate' | 'vigorous';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  has_asthma_or_respiratory: boolean;
  is_pregnant?: boolean;
  commute_mode: CommuteMode;
  default_activity: ActivityIntensity;
}

export interface HouseholdSetup {
  has_air_purifier: boolean;
  purifier_count: number;
  cooking_fuel: CookingFuel;
  has_exhaust_chimney: boolean;
  window_sealing_quality: string;
}

export interface LocationProfile {
  name: string;
  state: string;
  latitude: float;
  longitude: float;
}

type float = number;

export interface UserProfile {
  user_name: string;
  language: string; // en, hi, ta, te, mr
  location: LocationProfile;
  members: FamilyMember[];
  household: HouseholdSetup;
  isOnboarded?: boolean;
}

export interface AQIReading {
  aqi: number;
  category: AqiCategory;
  pm25: number;
  pm10?: number;
  humidity?: number;
  temperature?: number;
  dominant_pollutant: string;
  station_name: string;
  distance_km?: number;
  is_modelled: boolean;
  source: string;
  data_freshness_text: string;
}

export interface SafeWindow {
  start_time: string;
  end_time: string;
  average_aqi: number;
  category: AqiCategory;
  reason: string;
}

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  aqi: number;
  category: AqiCategory;
  pm25: number;
  is_safest_window: boolean;
}

export interface ForecastResponse {
  hourly: HourlyForecastPoint[];
  safe_window: SafeWindow;
  caution_note: string;
}

export interface MemberRiskGuidance {
  member_id: string;
  member_name: string;
  relationship: string;
  age: number;
  risk_score: number;
  verdict: 'safe' | 'be_careful' | 'avoid';
  verdict_label: string;
  badge_color: string;
  icon: string;
  reasons: string[];
  action_directive: string;
}

export interface ChecklistAction {
  id: string;
  title: string;
  category: string;
  icon_emoji: string;
  co2_saved_kg?: number;
  pm25_avoided_ug?: number;
  is_completed?: boolean;
  impact_statement: string;
}

export interface DailyAdviceResponse {
  greeting: string;
  one_line_instruction: string;
  aqi_reading: AQIReading;
  safe_window: SafeWindow;
  family_guidance: MemberRiskGuidance[];
  checklist: ChecklistAction[];
  household_clean_score: number;
  lifestyle_banner: string;
  is_offline_mode: boolean;
  region_summary: string;
}

export interface AskResponse {
  verdict: 'safe' | 'be_careful' | 'avoid';
  verdict_label: string;
  reason: string;
  suggestion: string;
  impact: string;
  safer_time?: string;
  needs_doctor: boolean;
  doctor_advice?: string;
  language: string;
  is_offline_fallback: boolean;
}

export interface CalculationDetail {
  value: number;
  unit: string;
  formula: string;
  assumption: string;
  source_note: string;
}

export interface ActionImpactBreakdown {
  action_id: string;
  action_title: string;
  choice_made: string;
  effect_description: string;
  number_highlight: string;
  calculation: CalculationDetail;
  nature_equivalent: string;
  icon: string;
}

export interface ImpactReportResponse {
  total_co2_avoided_kg: number;
  total_pm25_exposure_reduced_pct: number;
  nature_equivalent: string;
  streak_clean_days: number;
  weekly_history: Array<{
    day: string;
    short: string;
    completed: boolean;
    co2_kg: number;
    is_today?: boolean;
  }>;
  action_breakdowns: ActionImpactBreakdown[];
  methodology_note: string;
}

export interface GeocodingResult {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  country: string;
  display_name: string;
}
