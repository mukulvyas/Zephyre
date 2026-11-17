"""Personal and Household Air Quality Risk Scoring Engine.

Deterministic, transparent scoring matrix mapping:
AQI Category x Person Vulnerabilities x Activity x Commute x Home Setup -> (Verdict, Reasons, Score)
"""

from typing import List, Tuple

from app.core.aqi_cpcb import AqiCategory
from app.models.advice import MemberRiskGuidance, RiskVerdict
from app.models.profile import (
    ActivityIntensity,
    CommuteMode,
    CookingFuel,
    FamilyMember,
    HouseholdSetup,
)

BASE_AQI_RISK_SCORES = {
    AqiCategory.GOOD: 10,
    AqiCategory.SATISFACTORY: 25,
    AqiCategory.MODERATE: 45,
    AqiCategory.POOR: 65,
    AqiCategory.VERY_POOR: 85,
    AqiCategory.SEVERE: 100,
}


def compute_member_risk(
    member: FamilyMember,
    aqi_category: AqiCategory,
    household: HouseholdSetup,
    activity_override: ActivityIntensity | None = None,
) -> MemberRiskGuidance:
    """Calculate personal risk score (0-100), reasons, verdict, and actionable directive."""
    score = BASE_AQI_RISK_SCORES[aqi_category]
    reasons: List[str] = []

    # 1. Age Vulnerability
    if member.age <= 10:
        score += 15
        reasons.append(
            "Children's developing lungs breathe 2-3x more air per kg of body weight than adults."
        )
    elif member.age >= 60:
        score += 15
        reasons.append(
            "Senior airway defense and cardiovascular reserve are more vulnerable to fine particulates."
        )

    # 2. Asthma / Respiratory Condition
    if member.has_asthma_or_respiratory:
        score += 25
        reasons.append(
            "Pre-existing asthma/respiratory sensitivity increases risk of bronchial spasm and airway inflammation."
        )

    if member.is_pregnant:
        score += 20
        reasons.append(
            "Maternal-fetal circulation is sensitive to microscopic PM2.5 crossing into bloodstream."
        )

    # 3. Activity Intensity
    activity = activity_override or member.default_activity
    if activity == ActivityIntensity.VIGOROUS:
        score += 20
        reasons.append(
            "Vigorous outdoor exercise switches to mouth breathing, bypassing nasal filtration and pulling particulates deep."
        )
    elif activity == ActivityIntensity.MODERATE:
        score += 5

    # 4. Commute Mode Exposure
    if member.commute_mode in (CommuteMode.TWO_WHEELER, CommuteMode.WALK_CYCLE):
        if aqi_category in (AqiCategory.POOR, AqiCategory.VERY_POOR, AqiCategory.SEVERE):
            score += 15
            reasons.append("Open road commute exposes directly to concentrated vehicular tailpipe emissions.")
    elif member.commute_mode == CommuteMode.METRO:
        score -= 10  # Underground / enclosed filtered metro transit reduces exposure

    # 5. Household Mitigation
    if not household.has_air_purifier and aqi_category in (AqiCategory.VERY_POOR, AqiCategory.SEVERE):
        score += 10
        reasons.append("No indoor HEPA purifier available during high outdoor pollution.")
    elif household.has_air_purifier:
        score -= 10

    if household.cooking_fuel == CookingFuel.BIOMASS_CHULHA:
        score += 20
        reasons.append("Unvented indoor biomass smoke compounds outdoor particulate load.")

    # Clamp score to 0-100
    final_score = max(5, min(100, score))

    # Verdict Assignment
    if final_score <= 40:
        verdict = RiskVerdict.SAFE
        badge_color = "green"
        icon = "verified"
    elif final_score <= 70:
        verdict = RiskVerdict.BE_CAREFUL
        badge_color = "amber"
        icon = "warning"
    else:
        verdict = RiskVerdict.AVOID
        badge_color = "red"
        icon = "shield"

    # Verdict label and action directive
    verdict_label, directive = _derive_verdict_directive(member, aqi_category, verdict)

    return MemberRiskGuidance(
        member_id=member.id,
        member_name=member.name,
        relationship=member.relationship,
        age=member.age,
        risk_score=final_score,
        verdict=verdict,
        verdict_label=verdict_label,
        badge_color=badge_color,
        icon=icon,
        reasons=reasons,
        action_directive=directive,
    )


def _derive_verdict_directive(
    member: FamilyMember, aqi_category: AqiCategory, verdict: RiskVerdict
) -> Tuple[str, str]:
    """Derive concise label and directive tailored to age and condition."""
    is_child = member.age <= 10
    is_elderly = member.age >= 60

    if aqi_category in (AqiCategory.GOOD, AqiCategory.SATISFACTORY):
        return ("Fresh Air", "Great day for outdoor walks, park play, and natural ventilation.")

    if verdict == RiskVerdict.AVOID:
        if member.has_asthma_or_respiratory:
            return ("Stay in, inhaler ready", "Stay indoors in a sealed room with purifier running; keep quick-relief inhaler within arm's reach.")
        elif is_child:
            return ("Indoor play only", "Move all sports and outdoor games inside; avoid school playgrounds during smog hours.")
        elif is_elderly:
            return ("Stay indoors", "Avoid morning walks; do gentle stretching or indoor walking instead.")
        else:
            return ("Avoid outdoor exertion", "Limit outdoor time strictly; wear a well-fitted N95 mask during necessary transit.")

    if verdict == RiskVerdict.BE_CAREFUL:
        if member.has_asthma_or_respiratory:
            return ("Caution: Mask up", "Wear an N95 if stepping out; avoid active traffic junctions.")
        elif is_child:
            return ("Light play only", "Keep outdoor play to short intervals; avoid vigorous sprints.")
        elif member.commute_mode == CommuteMode.METRO:
            return ("N95 for transit", "Take metro instead of open auto; wear N95 on platform.")
        else:
            return ("Wear N95 Mask", "Wear protective mask outdoors and avoid strenuous exertion.")

    return ("Safe today", "Proceed with daily schedule; normal ventilation is fine.")


def compute_household_clean_score(
    guidances: List[MemberRiskGuidance],
    household: HouseholdSetup,
    checklist_completed_count: int,
    checklist_total_count: int,
) -> int:
    """Calculate overall household sanctuary score (0-100).

    Formula documented in docs/DECISION_LOGIC.md:
    Base (50)
    + Household protection assets (+15 for purifiers, +10 for exhaust, +5 for LPG/electric)
    + Checklist compliance (+20 * completed / total)
    - Average family vulnerability penalty (-0.2 * average_risk_score)
    """
    base = 50.0

    if household.has_air_purifier:
        base += 15.0
    if household.has_exhaust_chimney:
        base += 10.0
    if household.cooking_fuel in (CookingFuel.LPG, CookingFuel.ELECTRIC, CookingFuel.PIPED_NATURAL_GAS):
        base += 5.0
    else:
        base -= 10.0

    if checklist_total_count > 0:
        base += 20.0 * (checklist_completed_count / checklist_total_count)

    if guidances:
        avg_risk = sum(g.risk_score for g in guidances) / len(guidances)
        base -= avg_risk * 0.15

    return max(10, min(100, round(base)))
