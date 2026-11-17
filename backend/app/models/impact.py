"""Impact and Emission Factor Models."""

from typing import List

from pydantic import BaseModel


class CalculationDetail(BaseModel):
    value: float
    unit: str
    formula: str
    assumption: str
    source_note: str


class ActionImpactBreakdown(BaseModel):
    action_id: str
    action_title: str
    choice_made: str
    effect_description: str
    number_highlight: str
    calculation: CalculationDetail
    nature_equivalent: str
    icon: str


class ImpactReportResponse(BaseModel):
    total_co2_avoided_kg: float
    total_pm25_exposure_reduced_pct: float
    nature_equivalent: str
    streak_clean_days: int
    weekly_history: List[dict]
    action_breakdowns: List[ActionImpactBreakdown]
    methodology_note: str
