"""AQI Data and Hourly Forecast Routes."""

from fastapi import APIRouter, Query

from app.services.aqi_provider import get_live_aqi
from app.services.forecast import get_hourly_forecast

router = APIRouter(prefix="/api/aqi", tags=["aqi"])


@router.get("", response_model=dict)
async def get_aqi_and_forecast(
    lat: float = Query(28.5355, ge=6.0, le=38.0, description="Latitude in India"),
    lng: float = Query(77.2410, ge=68.0, le=98.0, description="Longitude in India"),
    city: str = Query("New Delhi", max_length=100, description="City or locality name"),
):
    """Retrieve live CPCB AQI and 24-hour forecast with safest outdoor window."""
    reading = await get_live_aqi(latitude=lat, longitude=lng, city_name=city)
    forecast = await get_hourly_forecast(latitude=lat, longitude=lng)

    return {
        "reading": reading,
        "forecast": forecast,
    }
