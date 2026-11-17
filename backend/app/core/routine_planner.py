"""Daily Routine and Clean-Air Action Planner.

Generates:
- Today's one-line directive (e.g. "Keep windows sealed and bundle up with an N95 when stepping out")
- Best outdoor window from hourly forecast
- 3-4 actionable "Do today" checklist items with icons, CO2/PM2.5 metrics
- Lifestyle encouragement banner
"""

from typing import List, Tuple
from app.core.aqi_cpcb import AqiCategory, get_aqi_category
from app.models.advice import ChecklistAction
from app.models.aqi import HourlyForecastPoint, SafeWindow
from app.models.profile import CommuteMode, HouseholdSetup, UserProfile


def find_safest_outdoor_window(hourly_points: List[HourlyForecastPoint]) -> Tuple[SafeWindow, str]:
    """Analyze 24h hourly forecast to identify the window with lowest AQI."""
    if not hourly_points:
        return (
            SafeWindow(
                start_time="14:00",
                end_time="16:00",
                average_aqi=260,
                category=AqiCategory.POOR,
                reason="Afternoon sunlight typically breaks ground-level winter thermal inversions.",
            ),
            "Avoid morning walks or park play before 11:00 AM today.",
        )

    # Search for best 2-3 hour contiguous daytime window between 09:00 and 18:00
    daytime = [p for p in hourly_points if 9 <= p.hour <= 18]
    if not daytime:
        daytime = hourly_points

    # Find the hour with minimum AQI
    best_point = min(daytime, key=lambda p: p.aqi)
    best_hour = best_point.hour

    start_h = max(7, best_hour - 1)
    end_h = min(20, best_hour + 1)

    window_points = [p for p in hourly_points if start_h <= p.hour <= end_h]
    avg_aqi = round(sum(p.aqi for p in window_points) / len(window_points)) if window_points else best_point.aqi
    cat = get_aqi_category(avg_aqi)

    # Format 12-hour AM/PM
    def fmt_hour(h: int) -> str:
        am_pm = "AM" if h < 12 else "PM"
        hour_12 = h if (h == 12 or h == 0) else h % 12
        if hour_12 == 0:
            hour_12 = 12
        return f"{hour_12}:00 {am_pm}"

    start_str = fmt_hour(start_h)
    end_str = fmt_hour(end_h)

    reason = f"AQI dips to ~{avg_aqi} with daytime sunlight dispersal. Essential errands are best scheduled here."
    caution = "Avoid morning walks and strenuous exercise before 11:00 AM when cold smog stays trapped near the ground."

    # Mark points
    for p in hourly_points:
        p.is_safest_window = start_h <= p.hour <= end_h

    return (
        SafeWindow(
            start_time=start_str,
            end_time=end_str,
            average_aqi=avg_aqi,
            category=cat,
            reason=reason,
        ),
        caution,
    )


def generate_one_line_instruction(aqi_category: AqiCategory) -> str:
    """Generate the core 5-second top instruction banner."""
    if aqi_category == AqiCategory.GOOD:
        return "Air is crisp and clean today. Perfect for full morning ventilation and outdoor play!"
    elif aqi_category == AqiCategory.SATISFACTORY:
        return "Air quality is satisfactory. Open windows for fresh air exchange before afternoon haze."
    elif aqi_category == AqiCategory.MODERATE:
        return "Moderate smog in your locality. Sensitive family members should take easy breaks outdoors."
    elif aqi_category == AqiCategory.POOR:
        return "Poor air today. Wear an N95 mask during transit and shift intense workouts indoors."
    elif aqi_category == AqiCategory.VERY_POOR:
        return "Keep windows sealed and bundle up with an N95 when stepping out."
    else:  # SEVERE
        return "Severe emergency smog! Keep children and seniors strictly indoors and run purifiers continuously."


def generate_daily_checklist(
    aqi_category: AqiCategory, profile: UserProfile
) -> List[ChecklistAction]:
    """Generate 4 tailored daily checklist actions with explainable impact."""
    actions: List[ChecklistAction] = []

    # 1. Mask Action
    if aqi_category in (AqiCategory.POOR, AqiCategory.VERY_POOR, AqiCategory.SEVERE):
        actions.append(
            ChecklistAction(
                id="act_mask",
                title="Wear N95 Mask outside (skip surgical/cloth)",
                category="outdoor",
                icon_emoji="😷",
                pm25_avoided_ug=180.0,
                impact_statement="Filters 95%+ of PM2.5 microparticulates compared to 20-30% with basic cloth masks.",
            )
        )
    else:
        actions.append(
            ChecklistAction(
                id="act_vent",
                title="Open cross-windows for 30 min during afternoon breeze",
                category="indoor",
                icon_emoji="🪟",
                impact_statement="Flushes indoor CO2 and kitchen cooking moisture when outdoor air is at its cleanest.",
            )
        )

    # 2. Indoor Purifier Action
    if profile.household.has_air_purifier:
        actions.append(
            ChecklistAction(
                id="act_purifier",
                title="Run purifier on High in bedrooms & living room",
                category="indoor",
                icon_emoji="🌀",
                pm25_avoided_ug=250.0,
                impact_statement="Reduces indoor particulate concentration by 70-85% in sealed 150 sq ft spaces.",
            )
        )
    else:
        actions.append(
            ChecklistAction(
                id="act_plants",
                title="Wipe indoor plant leaves and seal window draft gaps",
                category="indoor",
                icon_emoji="🪴",
                impact_statement="Seals drafty frames with rolled towels or foam strips to reduce outdoor dust infiltration by 30%.",
            )
        )

    # 3. Transit Action
    has_transit_user = any(
        m.commute_mode in (CommuteMode.METRO, CommuteMode.BUS, CommuteMode.CAR_AC, CommuteMode.TWO_WHEELER)
        for m in profile.members
    )
    if has_transit_user:
        actions.append(
            ChecklistAction(
                id="act_transit",
                title="Take Metro instead of open auto or private cab",
                category="transit",
                icon_emoji="🚇",
                co2_saved_kg=1.8,
                impact_statement="Saves ~1.8 kg CO2 per 15 km trip while keeping your lungs away from roadway exhaust plumes.",
            )
        )
    else:
        actions.append(
            ChecklistAction(
                id="act_errand",
                title="Combine outdoor errands into a single afternoon trip",
                category="transit",
                icon_emoji="🚲",
                co2_saved_kg=0.8,
                impact_statement="Cuts unnecessary cold-start engine trips and limits time spent in heavy traffic intersections.",
            )
        )

    # 4. Household Cleaning / Cooking Action
    actions.append(
        ChecklistAction(
            id="act_cleaning",
            title="Damp-mop floors (skip dry sweeping)",
            category="home",
            icon_emoji="🧹",
            pm25_avoided_ug=95.0,
            impact_statement="Traps settled fine dust on floor surfaces rather than kicking microscopic particles back into breathing zones.",
        )
    )

    return actions[:4]


def generate_lifestyle_banner(aqi_category: AqiCategory) -> str:
    """Reassuring, non-alarmist lifestyle banner."""
    if aqi_category in (AqiCategory.GOOD, AqiCategory.SATISFACTORY):
        return "Breathe easy and enjoy the day. Clean air brings great energy to the whole family."
    elif aqi_category == AqiCategory.MODERATE:
        return "Stay mindful of smog peaks. Small mindful routine tweaks keep everyone feeling comfortable."
    else:
        return "You've got this handled. Simple consistent daily habits noticeably cut your family's pollution intake."
