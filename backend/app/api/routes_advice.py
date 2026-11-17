"""Daily Advice and Interactive Ask Routes."""

import asyncio

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.core.region_context import get_region_context
from app.core.risk_engine import compute_household_clean_score, compute_member_risk
from app.core.routine_planner import (
    generate_daily_checklist,
    generate_lifestyle_banner,
    generate_one_line_instruction,
)
from app.core.safety import (
    check_medical_emergency,
    check_prompt_injection,
    sanitize_input,
)
from app.models.advice import (
    AskQuestionRequest,
    AskResponse,
    DailyAdviceResponse,
    RiskVerdict,
)
from app.models.profile import UserProfile
from app.services.aqi_provider import get_live_aqi
from app.services.forecast import get_hourly_forecast
from app.services.llm.gemini import llm_provider

router = APIRouter(prefix="/api/advice", tags=["advice"])


@router.post("/daily", response_model=DailyAdviceResponse)
async def get_daily_advice(profile: UserProfile):
    """Generate personalized daily clean-air plan and routine."""
    loc = profile.location

    # Fetch live AQI and hourly forecast concurrently
    reading_task = get_live_aqi(loc.latitude, loc.longitude, loc.name)
    forecast_task = get_hourly_forecast(loc.latitude, loc.longitude)

    reading, forecast = await asyncio.gather(reading_task, forecast_task)

    # Risk assessment per family member
    guidances = [
        compute_member_risk(member, reading.category, profile.household)
        for member in profile.members
    ]

    # Generate tailored daily checklist
    checklist = generate_daily_checklist(reading.category, profile)

    # Compute overall household sanctuary clean score
    clean_score = compute_household_clean_score(
        guidances=guidances,
        household=profile.household,
        checklist_completed_count=1,
        checklist_total_count=len(checklist),
    )

    one_liner = generate_one_line_instruction(reading.category)
    lifestyle = generate_lifestyle_banner(reading.category)
    region_info = get_region_context(loc.state or loc.name)

    greeting = f"Good morning, {profile.user_name}."

    return DailyAdviceResponse(
        greeting=greeting,
        one_line_instruction=one_liner,
        aqi_reading=reading,
        safe_window=forecast.safe_window,
        family_guidance=guidances,
        checklist=checklist,
        household_clean_score=clean_score,
        lifestyle_banner=lifestyle,
        is_offline_mode=not bool(settings.GEMINI_API_KEY),
        region_summary=f"{region_info.region_name}: {region_info.local_tip}",
    )


@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskQuestionRequest):
    """Answer an air quality question grounded in deterministic rules + GenAI."""
    raw_q = request.question
    cleaned_q = sanitize_input(raw_q)

    # 1. Prompt Injection Defense
    is_injection, _ = check_prompt_injection(cleaned_q)
    if is_injection:
        raise HTTPException(
            status_code=400,
            detail="Your request contains prohibited directives or system overrides.",
        )

    # 2. Medical Emergency Guard
    needs_doctor, emergency_directive = check_medical_emergency(cleaned_q)
    if needs_doctor:
        return AskResponse(
            verdict=RiskVerdict.AVOID,
            verdict_label="Medical Alert: Consult Doctor",
            reason="Acute symptoms such as chest pain, severe breathlessness, or coughing blood require urgent medical evaluation rather than lifestyle adjustments.",
            suggestion="Immediately use your prescribed quick-relief inhaler and seek medical attention.",
            impact="Prioritizes personal health and life safety above routine air quality advice.",
            safer_time=None,
            needs_doctor=True,
            doctor_advice=emergency_directive,
            language=request.language,
            is_offline_fallback=True,
        )

    # 3. Build Ground Truth Facts from User Profile & Location
    profile_data = request.profile_override or {}
    city_name = profile_data.get("location", {}).get("name", "New Delhi")
    lat = profile_data.get("location", {}).get("latitude", 28.5355)
    lng = profile_data.get("location", {}).get("longitude", 77.2410)

    reading = await get_live_aqi(lat, lng, city_name)
    forecast = await get_hourly_forecast(lat, lng)

    # Check if a specific member is mentioned
    mentioned_member = None
    members = profile_data.get("members", [])
    for m in members:
        m_name = m.get("name", "").lower()
        if m_name and m_name in cleaned_q.lower():
            mentioned_member = m
            break

    # Determine ground-truth verdict
    if reading.category in ("Very Poor", "Severe"):
        verdict = RiskVerdict.AVOID
    elif reading.category == "Poor":
        verdict = RiskVerdict.BE_CAREFUL if not mentioned_member or not mentioned_member.get("has_asthma_or_respiratory") else RiskVerdict.AVOID
    else:
        verdict = RiskVerdict.SAFE

    ground_truth = {
        "aqi": reading.aqi,
        "category": reading.category.value if hasattr(reading.category, "value") else str(reading.category),
        "city": city_name,
        "verdict": verdict.value,
        "safe_window": f"{forecast.safe_window.start_time} – {forecast.safe_window.end_time}",
        "member_context": mentioned_member.get("name") if mentioned_member else "general family member",
    }

    # 4. Invoke LLM Provider (with graceful rule-based degradation)
    response = await llm_provider.answer_question(
        sanitized_question=cleaned_q,
        ground_truth_context=ground_truth,
        language=request.language,
    )

    return response
