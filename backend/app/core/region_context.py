"""State-wise Indian Air Quality Context Lookup.

Provides regional meteorology, dominant pollution sources, seasonal inversion trends,
and tailored local clean-air suggestions.
"""

from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class RegionAirContext:
    region_name: str
    primary_sources: str
    seasonal_dynamic: str
    local_tip: str
    stubble_burning_risk: bool
    dust_dominant: bool
    coastal: bool


# Normalized state/UT mappings
REGION_REGISTRY: Dict[str, RegionAirContext] = {
    "delhi": RegionAirContext(
        region_name="Delhi-NCR",
        primary_sources="Vehicular emissions, post-harvest crop stubble burning, regional dust, industrial clusters",
        seasonal_dynamic="Severe winter thermal inversion traps cold boundary layer air from November to February, causing stagnant hazardous smog.",
        local_tip="Seal doors and windows before early morning fog settles; postpone outdoor workouts until afternoon sunlight lifts the inversion layer.",
        stubble_burning_risk=True,
        dust_dominant=False,
        coastal=False,
    ),
    "punjab": RegionAirContext(
        region_name="Punjab",
        primary_sources="Agricultural paddy stubble burning, highway diesel corridors, brick kilns",
        seasonal_dynamic="Peak seasonal smoke spikes in Oct-Nov, followed by dense winter fog (smog) with low boundary layer.",
        local_tip="Avoid outdoor morning cycling and open-air burning; keep livestock sheds ventilated with cross-breeze away from smoke plume.",
        stubble_burning_risk=True,
        dust_dominant=False,
        coastal=False,
    ),
    "haryana": RegionAirContext(
        region_name="Haryana",
        primary_sources="Paddy residue burning, industrial manufacturing, transit trucks, highway dust",
        seasonal_dynamic="Heavy autumn stubble smoke merging with north-westerly winter chill and low wind speed.",
        local_tip="Keep N95 masks ready for rural and semi-urban commutes; avoid dry sweeping dusty verandas.",
        stubble_burning_risk=True,
        dust_dominant=False,
        coastal=False,
    ),
    "uttar pradesh": RegionAirContext(
        region_name="Uttar Pradesh (Indo-Gangetic Plain)",
        primary_sources="Biomass cooking, brick kilns, crop residue, unpaved road dust, high-density traffic",
        seasonal_dynamic="River basin geography traps pollutants across Lucknow, Kanpur, and Varanasi throughout winter calm winds.",
        local_tip="Switch from biomass/cow-dung chulhas to LPG/electric cooking; use damp mop on floors daily.",
        stubble_burning_risk=True,
        dust_dominant=True,
        coastal=False,
    ),
    "karnataka": RegionAirContext(
        region_name="Karnataka (Bengaluru Urban)",
        primary_sources="Severe peak-hour vehicular gridlock, construction debris, road dust re-suspension",
        seasonal_dynamic="Milder winter temperatures prevent deep thermal inversions, but traffic bottlenecks cause acute localized PM2.5/PM10 spikes.",
        local_tip="Travel off-peak or take Namma Metro; keep car cabin AC strictly on recirculation mode during ring road traffic jams.",
        stubble_burning_risk=False,
        dust_dominant=True,
        coastal=False,
    ),
    "telangana": RegionAirContext(
        region_name="Telangana (Hyderabad)",
        primary_sources="Vehicular traffic, construction dust, pharmaceutical & industrial corridors",
        seasonal_dynamic="Dry winter weather and thermal turbulence during afternoons; morning haze dissipates relatively early.",
        local_tip="Opt for Hyderabad Metro or multi-modal MMTS; dust window sills with wet microfiber cloth.",
        stubble_burning_risk=False,
        dust_dominant=True,
        coastal=False,
    ),
    "maharashtra": RegionAirContext(
        region_name="Maharashtra (Mumbai & Pune)",
        primary_sources="Heavy traffic, high-rise construction, port activity, coastal industrial belts",
        seasonal_dynamic="Land and sea breeze cycle usually clears air by midday, but winter wind reversals can stagnate sea-salt and urban particulate mix.",
        local_tip="Walk or jog during the mid-morning sea breeze window; avoid running alongside coastal arterial roads during peak rush hours.",
        stubble_burning_risk=False,
        dust_dominant=False,
        coastal=True,
    ),
    "tamil nadu": RegionAirContext(
        region_name="Tamil Nadu (Chennai)",
        primary_sources="Vehicular traffic, petrochemical plants, harbor shipping, post-monsoon humidity",
        seasonal_dynamic="Northeast monsoon keeps winter relatively warm and humid, resulting in milder smog than northern plains.",
        local_tip="Use dehumidification alongside standard filtration; enjoy coastal mornings when sea breeze is blowing inland.",
        stubble_burning_risk=False,
        dust_dominant=False,
        coastal=True,
    ),
    "west bengal": RegionAirContext(
        region_name="West Bengal (Kolkata & Asansol)",
        primary_sources="Coal thermal units, brick kilns, diesel buses, winter river valley fog",
        seasonal_dynamic="Winter brings low nocturnal temperatures and river basin smog entrapment across the Hooghly belt.",
        local_tip="Keep windows closed between 6 AM and 9 AM; run air filtration during morning tea hours.",
        stubble_burning_risk=False,
        dust_dominant=False,
        coastal=False,
    ),
}

DEFAULT_CONTEXT = RegionAirContext(
    region_name="Urban India",
    primary_sources="Vehicular transport, road dust, construction activity, household emissions",
    seasonal_dynamic="Winter cooling reduces atmospheric boundary layer height, concentrating particulates near ground level.",
    local_tip="Check the live hourly window before planning outdoor sports or errands; prioritize public transit and wet-mopping.",
    stubble_burning_risk=False,
    dust_dominant=False,
    coastal=False,
)


# Aliases mapping to state keys
CITY_STATE_ALIASES: Dict[str, str] = {
    "delhi": "delhi",
    "noida": "delhi",
    "gurugram": "delhi",
    "gurgaon": "delhi",
    "faridabad": "delhi",
    "ghaziabad": "delhi",
    "mumbai": "maharashtra",
    "pune": "maharashtra",
    "nagpur": "maharashtra",
    "thane": "maharashtra",
    "bengaluru": "karnataka",
    "bangalore": "karnataka",
    "mysuru": "karnataka",
    "hyderabad": "telangana",
    "secunderabad": "telangana",
    "chennai": "tamil nadu",
    "coimbatore": "tamil nadu",
    "madurai": "tamil nadu",
    "kolkata": "west bengal",
    "howrah": "west bengal",
    "asansol": "west bengal",
    "lucknow": "uttar pradesh",
    "kanpur": "uttar pradesh",
    "varanasi": "uttar pradesh",
    "agra": "uttar pradesh",
    "chandigarh": "punjab",
    "ludhiana": "punjab",
    "amritsar": "punjab",
}


def get_region_context(state_or_city: str) -> RegionAirContext:
    """Lookup regional air context by state or city name."""
    query = state_or_city.strip().lower()

    # Check direct region registry
    for key, context in REGION_REGISTRY.items():
        if key in query or query in key:
            return context

    # Check city aliases
    for city, mapped_state in CITY_STATE_ALIASES.items():
        if city in query:
            if mapped_state in REGION_REGISTRY:
                return REGION_REGISTRY[mapped_state]

    return DEFAULT_CONTEXT
