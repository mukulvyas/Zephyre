"""Daily Routine Advice and Ask Response Models."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.aqi import AQIReading, SafeWindow


class RiskVerdict(str, Enum):
    SAFE = "safe"
    BE_CAREFUL = "be_careful"
    AVOID = "avoid"


class MemberRiskGuidance(BaseModel):
    member_id: str
    member_name: str
    relationship: str
    age: int
    risk_score: int = Field(..., ge=0, le=100, description="Personal vulnerability score 0-100")
    verdict: RiskVerdict
    verdict_label: str = Field(..., description="Short tag e.g. 'Indoor play only', 'Stay in, inhaler ready'")
    badge_color: str = Field("orange", description="green, yellow, orange, red")
    icon: str = Field("shield", description="Material icon name or emoji")
    reasons: List[str] = Field(default_factory=list)
    action_directive: str


class ChecklistAction(BaseModel):
    id: str
    title: str
    category: str = Field("outdoor", description="outdoor, indoor, transit, home")
    icon_emoji: str
    co2_saved_kg: Optional[float] = None
    pm25_avoided_ug: Optional[float] = None
    is_completed: bool = False
    impact_statement: str


class AskQuestionRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=300, description="Free-text question capped at 300 chars")
    profile_override: Optional[dict] = None
    language: str = Field("en", description="en, hi, ta, te, mr")


class AskResponse(BaseModel):
    verdict: RiskVerdict
    verdict_label: str = Field(..., description="Official label e.g. 'Avoid Outdoor Coaching'")
    reason: str = Field(..., max_length=400, description="At most 2 concise sentences")
    suggestion: str = Field(..., description="Practical low-emission alternative")
    impact: str = Field(..., description="Choice -> Effect -> Number format")
    safer_time: Optional[str] = Field(None, description="Recommended safer hour or window")
    needs_doctor: bool = Field(False, description="Flagged if question mentions severe medical symptoms")
    doctor_advice: Optional[str] = Field(None, description="Urgent medical caution and emergency disclaimer")
    language: str = Field("en")
    is_offline_fallback: bool = Field(False)


class DailyAdviceResponse(BaseModel):
    greeting: str
    one_line_instruction: str
    aqi_reading: AQIReading
    safe_window: SafeWindow
    family_guidance: List[MemberRiskGuidance]
    checklist: List[ChecklistAction]
    household_clean_score: int = Field(..., ge=0, le=100)
    lifestyle_banner: str
    is_offline_mode: bool = False
    region_summary: str
