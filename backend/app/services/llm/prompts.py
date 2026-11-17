"""Prompt templates, System Instructions, and Rule-Based Offline Fallbacks."""

import json
from typing import Any, Dict

from app.models.advice import AskResponse, RiskVerdict

SYSTEM_INSTRUCTION = """You are Zephyre Air Quality Coach, an empathetic, science-grounded air quality assistant for Indian families.
Your mission is to help families navigate winter smog and urban air pollution with practical, low-emission daily routines.

CRITICAL RULES:
1. GROUND TRUTH FIDELITY: The provided GROUND_TRUTH dictionary contains the pre-calculated verdict, AQI category, numeric impact, and safer times from our deterministic engineering model. You MUST NOT change the verdict, invent new numbers, or make unverified medical claims.
2. CHOICE -> EFFECT -> NUMBER: Frame suggestions following the pattern: Choice made -> Practical effect -> Tangible number/benefit.
3. CONCISE & WARM: Keep reasons to AT MOST 2 sentences. Sound like a caring family physician and elder sibling.
4. LANGUAGE: Provide your answer in the requested language (en = English, hi = Hindi, ta = Tamil, te = Telugu, mr = Marathi). Always keep the official verdict label clear.
5. MEDICAL SAFETY: You are not a doctor. Never diagnose illnesses. If symptoms mention severe breathlessness, chest pain, or asthma emergencies, set needs_doctor=true.
6. FORMAT: Output MUST be a single raw JSON object matching the requested schema with NO markdown code blocks.
"""

SCHEMA_EXAMPLE = {
    "verdict": "avoid",
    "verdict_label": "Avoid Outdoor Coaching",
    "reason": "Delhi AQI at 4:30 PM is forecasted at 340 (Very Poor). Vigorous exercise causes children like Aarav to breathe 2-3x more air per minute, pulling micro-particulates deep into growing lungs.",
    "suggestion": "⚽ Move football indoors: do footwork drills, soft foam ball juggling, or living room coordination obstacle courses!",
    "impact": "💡 Keeps Aarav away from the worst air of the day while maintaining daily athletic rhythm.",
    "safer_time": "Tomorrow 2:00 PM - 4:00 PM when sunlight disperses ground-level smog",
    "needs_doctor": False,
    "doctor_advice": None,
    "language": "en",
    "is_offline_fallback": False,
}


def build_ask_prompt(
    sanitized_question: str,
    ground_truth: Dict[str, Any],
    language: str = "en",
) -> str:
    """Construct prompt for Gemini with ground-truth facts."""
    return f"""Language requested: {language}

GROUND_TRUTH FACTS (Strictly adhere to these, do not alter verdict or numbers):
{json.dumps(ground_truth, indent=2)}

UNTRUSTED_USER_QUESTION:
\"\"\"{sanitized_question}\"\"\"

Generate a JSON response conforming exactly to this structure:
{{
  "verdict": "{ground_truth.get('verdict', 'be_careful')}",
  "verdict_label": "short string",
  "reason": "at most 2 sentences explaining why based on ground truth",
  "suggestion": "practical low-emission alternative in {language}",
  "impact": "Choice -> Effect -> Number format",
  "safer_time": "time window or null",
  "needs_doctor": false,
  "doctor_advice": null,
  "language": "{language}"
}}
"""


def generate_rule_based_fallback(
    sanitized_question: str,
    ground_truth: Dict[str, Any],
    language: str = "en",
) -> AskResponse:
    """Generate high-quality rule-based fallback response when LLM is unavailable or offline."""
    verdict_str = ground_truth.get("verdict", "be_careful")
    verdict = RiskVerdict(verdict_str)
    aqi = ground_truth.get("aqi", 280)
    category = ground_truth.get("category", "Poor")
    city = ground_truth.get("city", "your area")
    safest_window = ground_truth.get("safe_window", "2:00 PM - 4:00 PM")
    q_lower = sanitized_question.lower()

    # Contextual alternatives based on question intent
    if "outside" in q_lower or "play" in q_lower or "coaching" in q_lower or "football" in q_lower:
        if verdict == RiskVerdict.AVOID:
            v_label = "Avoid Outdoor Play"
            reason = f"{city} AQI is currently {aqi} ({category} category). High exertion increases particulate intake by 3-4x, which irritates developing and sensitive airways."
            suggestion = "Move activity indoors: indoor coordination games, living room yoga, or foam ball drills."
            impact = "Keeps family members away from the worst air of the day while preserving physical activity."
        else:
            v_label = "Safe for Light Outdoor Play"
            reason = f"Current air in {city} is {category} (AQI {aqi}), which is acceptable for moderate activity."
            suggestion = "Enjoy light outdoor games; avoid prolonged high-intensity sprints."
            impact = "Balances healthy daily movement with low particulate exposure."
    elif "window" in q_lower or "fresh air" in q_lower or "ventilat" in q_lower:
        if verdict == RiskVerdict.AVOID:
            v_label = "Keep Windows Sealed"
            reason = f"Outdoor AQI is {aqi} ({category}). Opening windows will pull heavy smog and particulate soot into your living spaces."
            suggestion = f"Keep doors and windows shut now. Open briefly for cross-ventilation only during the safest window ({safest_window})."
            impact = "Reduces indoor dust infiltration by up to 60-70% when paired with HEPA filtration."
        else:
            v_label = "Open Windows for Fresh Air"
            reason = f"Air quality is {category} (AQI {aqi}), providing a good opportunity to flush indoor carbon dioxide."
            suggestion = "Open opposite windows for 20-30 minutes for a quick air refresh."
            impact = "Flushes stale indoor air and cooking moisture without trapping smog."
    elif "walk" in q_lower or "run" in q_lower or "jog" in q_lower:
        if verdict == RiskVerdict.AVOID:
            v_label = "Switch to Indoor Walk"
            reason = f"Ground-level smog in {city} is {category} (AQI {aqi}), which triggers airway inflammation during aerobic breathing."
            suggestion = f"Postpone outdoor walks to {safest_window}, or do 20 minutes of gentle indoor corridor walking."
            impact = "Keeps heart rate active while cutting airborne particulate exposure by ~80%."
        else:
            v_label = "Enjoy Outdoor Walk"
            reason = f"Air is {category} (AQI {aqi}). Walking outdoors is safe today."
            suggestion = "Choose tree-lined neighborhood paths away from busy traffic arteries."
            impact = "Healthy aerobic exercise with minimal pollution risk."
    elif "mask" in q_lower:
        v_label = "Wear N95 Respirator"
        reason = f"AQI of {aqi} ({category}) contains microscopic PM2.5 that passes straight through standard cloth and surgical masks."
        suggestion = "Use a certified N95 or FFP2 mask with a snug nose seal whenever stepping outside."
        impact = "Filters 95%+ of fine microparticulates compared to only 20-30% with basic single-layer cloth."
    else:
        # General response
        if verdict == RiskVerdict.AVOID:
            v_label = f"Avoid Outdoor Exertion ({category})"
            reason = f"Current air quality in {city} is {category} (AQI {aqi}). Smog and fine dust are concentrated near the surface."
            suggestion = f"Prioritize indoor activities and schedule outdoor errands between {safest_window}."
            impact = "Choice -> Effect -> Number: Timing activities with sunlight drops exposure by ~35%."
        elif verdict == RiskVerdict.BE_CAREFUL:
            v_label = f"Take Caution ({category})"
            reason = f"Air in {city} is {category} (AQI {aqi}). Sensitive groups should limit prolonged physical exertion."
            suggestion = "Wear an N95 mask near traffic and run indoor purifiers."
            impact = "Reduces inhaled particulate burden while keeping normal schedule intact."
        else:
            v_label = f"Safe Air ({category})"
            reason = f"Air in {city} is currently {category} (AQI {aqi}). Safe for regular routines."
            suggestion = "Carry on with your normal daily routine and natural ventilation."
            impact = "Optimal clean air conditions for the entire household."

    # Language localization for Hindi
    if language == "hi":
        reason = f"{city} में आज वायु गुणवत्ता {aqi} ({category}) है। हमारे नियम इंजन के अनुसार परिवार को सावधानी बरतनी चाहिए।"
        suggestion = "बाहरी गतिविधियों को दोपहर के समय करें या इनडोर विकल्प चुनें।"
        impact = "स्मार्ट विकल्पों से परिवार का प्रदूषण से बचाव होता है।"

    return AskResponse(
        verdict=verdict,
        verdict_label=v_label,
        reason=reason,
        suggestion=suggestion,
        impact=impact,
        safer_time=safest_window,
        needs_doctor=False,
        doctor_advice=None,
        language=language,
        is_offline_fallback=True,
    )
