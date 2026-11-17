"""Impact and Sustainability Reporting Routes."""

from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.impact_calculator import generate_impact_report
from app.models.impact import ImpactReportResponse

router = APIRouter(prefix="/api/impact", tags=["impact"])


class ImpactReportRequest(BaseModel):
    completed_action_ids: List[str] = Field(default_factory=list, description="List of completed task IDs")
    ambient_pm25: Optional[float] = Field(290.0, description="Ambient PM2.5 in µg/m³")


@router.post("", response_model=ImpactReportResponse)
async def get_impact_breakdown(request: ImpactReportRequest):
    """Generate explainable impact calculation with Choice -> Effect -> Number."""
    return generate_impact_report(
        completed_action_ids=request.completed_action_ids,
        ambient_pm25=request.ambient_pm25 or 290.0,
    )
