"""Indian Central Pollution Control Board (CPCB) AQI Calculation and Standards.

Breakpoint table for PM2.5 and PM10 according to CPCB guidelines:
- Good (0-50): PM2.5 (0-30), PM10 (0-50)
- Satisfactory (51-100): PM2.5 (31-60), PM10 (51-100)
- Moderate (101-200): PM2.5 (61-90), PM10 (101-250)
- Poor (201-300): PM2.5 (91-120), PM10 (251-350)
- Very Poor (301-400): PM2.5 (121-250), PM10 (351-430)
- Severe (401-500): PM2.5 (250-380+), PM10 (430-510+)
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class AqiCategory(str, Enum):
    GOOD = "Good"
    SATISFACTORY = "Satisfactory"
    MODERATE = "Moderate"
    POOR = "Poor"
    VERY_POOR = "Very Poor"
    SEVERE = "Severe"


@dataclass(frozen=True)
class CategoryMetadata:
    name: AqiCategory
    min_aqi: int
    max_aqi: int
    color_hex: str
    bg_class: str
    text_class: str
    border_class: str
    short_advice: str
    health_statement: str


CPCB_METADATA = {
    AqiCategory.GOOD: CategoryMetadata(
        name=AqiCategory.GOOD,
        min_aqi=0,
        max_aqi=50,
        color_hex="#10B981",  # Mint / emerald
        bg_class="bg-emerald-50 text-emerald-900",
        text_class="text-emerald-700",
        border_class="border-emerald-300",
        short_advice="Minimal health impact. Enjoy outdoor activities freely.",
        health_statement="Clean air. Safe for children, elderly, and sensitive groups.",
    ),
    AqiCategory.SATISFACTORY: CategoryMetadata(
        name=AqiCategory.SATISFACTORY,
        min_aqi=51,
        max_aqi=100,
        color_hex="#84CC16",  # Lime
        bg_class="bg-lime-50 text-lime-900",
        text_class="text-lime-700",
        border_class="border-lime-300",
        short_advice="Acceptable air quality. Minor breathing discomfort possible for highly sensitive people.",
        health_statement="Satisfactory air. General public unaffected.",
    ),
    AqiCategory.MODERATE: CategoryMetadata(
        name=AqiCategory.MODERATE,
        min_aqi=101,
        max_aqi=200,
        color_hex="#F59E0B",  # Amber
        bg_class="bg-amber-50 text-amber-900",
        text_class="text-amber-700",
        border_class="border-amber-300",
        short_advice="Breathing discomfort to people with asthma and lung diseases.",
        health_statement="Moderate air. Sensitive individuals should take breaks during heavy exertion.",
    ),
    AqiCategory.POOR: CategoryMetadata(
        name=AqiCategory.POOR,
        min_aqi=201,
        max_aqi=300,
        color_hex="#F97316",  # Orange
        bg_class="bg-orange-50 text-orange-900",
        text_class="text-orange-700",
        border_class="border-orange-300",
        short_advice="Breathing discomfort to most people on prolonged outdoor exposure.",
        health_statement="Poor air. Reduce prolonged outdoor exertion. Sensitive groups should wear N95.",
    ),
    AqiCategory.VERY_POOR: CategoryMetadata(
        name=AqiCategory.VERY_POOR,
        min_aqi=301,
        max_aqi=400,
        color_hex="#EF4444",  # Red / Coral
        bg_class="bg-red-50 text-red-900",
        text_class="text-red-700",
        border_class="border-red-300",
        short_advice="Respiratory illness on prolonged exposure. Pronounced effect on asthma and heart.",
        health_statement="Very Poor air. Keep windows closed, run purifiers, and wear N95 when stepping out.",
    ),
    AqiCategory.SEVERE: CategoryMetadata(
        name=AqiCategory.SEVERE,
        min_aqi=401,
        max_aqi=500,
        color_hex="#881337",  # Deep Maroon
        bg_class="bg-rose-100 text-rose-950",
        text_class="text-rose-900",
        border_class="border-rose-400",
        short_advice="Affects healthy people and seriously impacts those with existing diseases.",
        health_statement="Severe emergency air. Avoid all outdoor physical activity. Seal indoor environment.",
    ),
}

# CPCB Breakpoints: (B_lo, B_hi, I_lo, I_hi)
# PM2.5 in µg/m³
BREAKPOINTS_PM25 = [
    (0.0, 30.0, 0, 50),
    (30.1, 60.0, 51, 100),
    (60.1, 90.0, 101, 200),
    (90.1, 120.0, 201, 300),
    (120.1, 250.0, 301, 400),
    (250.1, 380.0, 401, 500),
]

# PM10 in µg/m³
BREAKPOINTS_PM10 = [
    (0.0, 50.0, 0, 50),
    (50.1, 100.0, 51, 100),
    (100.1, 250.0, 101, 200),
    (250.1, 350.0, 201, 300),
    (350.1, 430.0, 301, 400),
    (430.1, 510.0, 401, 500),
]


def _interpolate_sub_index(conc: float, breakpoints: list[tuple[float, float, int, int]]) -> int:
    """Linear interpolation formula per CPCB:
    I = [(I_hi - I_lo) / (B_hi - B_lo)] * (C - B_lo) + I_lo
    """
    if conc < 0:
        return 0

    for b_lo, b_hi, i_lo, i_hi in breakpoints:
        if conc <= b_hi:
            # Clamp to range
            c_val = max(b_lo, conc)
            denom = b_hi - b_lo
            if denom == 0:
                return i_lo
            sub_index = ((i_hi - i_lo) / denom) * (c_val - b_lo) + i_lo
            return round(sub_index)

    # If concentration exceeds highest breakpoint, extrapolate linearly capped at 500 (or beyond if severe)
    last_b_lo, last_b_hi, last_i_lo, last_i_hi = breakpoints[-1]
    denom = last_b_hi - last_b_lo
    extra = ((last_i_hi - last_i_lo) / denom) * (conc - last_b_lo) + last_i_lo
    return min(500, round(extra))


def calculate_sub_index_pm25(pm25: float) -> int:
    """Calculate CPCB sub-index for PM2.5 (µg/m³)."""
    return _interpolate_sub_index(pm25, BREAKPOINTS_PM25)


def calculate_sub_index_pm10(pm10: float) -> int:
    """Calculate CPCB sub-index for PM10 (µg/m³)."""
    return _interpolate_sub_index(pm10, BREAKPOINTS_PM10)


def calculate_cpcb_aqi(
    pm25: Optional[float] = None, pm10: Optional[float] = None
) -> tuple[int, str]:
    """Calculate CPCB AQI from PM2.5 and PM10 concentrations.

    Returns:
        tuple[int, str]: (AQI value, responsible dominant pollutant)
    """
    sub_pm25 = calculate_sub_index_pm25(pm25) if pm25 is not None else 0
    sub_pm10 = calculate_sub_index_pm10(pm10) if pm10 is not None else 0

    if sub_pm25 >= sub_pm10:
        return max(0, sub_pm25), "PM2.5"
    return max(0, sub_pm10), "PM10"


def get_aqi_category(aqi: int) -> AqiCategory:
    """Map numeric AQI to official CPCB category."""
    if aqi <= 50:
        return AqiCategory.GOOD
    elif aqi <= 100:
        return AqiCategory.SATISFACTORY
    elif aqi <= 200:
        return AqiCategory.MODERATE
    elif aqi <= 300:
        return AqiCategory.POOR
    elif aqi <= 400:
        return AqiCategory.VERY_POOR
    else:
        return AqiCategory.SEVERE


def get_category_metadata(category: AqiCategory) -> CategoryMetadata:
    """Return presentation and advisory metadata for an AQI category."""
    return CPCB_METADATA[category]
