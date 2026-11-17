"""AQI Reading and Forecast Pydantic Models."""

from typing import List, Optional

from pydantic import BaseModel, Field

from app.core.aqi_cpcb import AqiCategory


class AQIReading(BaseModel):
    aqi: int = Field(..., ge=0, le=999, description="CPCB AQI index value")
    category: AqiCategory = Field(..., description="CPCB category")
    pm25: float = Field(..., ge=0, description="PM2.5 concentration in µg/m³")
    pm10: Optional[float] = Field(None, ge=0, description="PM10 concentration in µg/m³")
    humidity: Optional[float] = Field(None, ge=0, le=100, description="Relative humidity %")
    temperature: Optional[float] = Field(None, description="Temperature in Celsius")
    dominant_pollutant: str = Field("PM2.5", description="Primary pollutant determining AQI")
    station_name: str = Field(..., description="Station or area name")
    distance_km: Optional[float] = Field(None, description="Distance to station if applicable")
    is_modelled: bool = Field(False, description="True if estimated from satellite/reanalysis")
    source: str = Field("cpcb_live", description="waqi, open_meteo, demo")
    data_freshness_text: str = Field("Live reading", description="e.g. '12m ago', 'Live reading'")


class HourlyForecastPoint(BaseModel):
    time: str = Field(..., description="ISO timestamp or formatted time e.g. '08:00'")
    hour: int = Field(..., ge=0, le=23)
    aqi: int = Field(..., ge=0)
    category: AqiCategory
    pm25: float
    is_safest_window: bool = Field(False)


class SafeWindow(BaseModel):
    start_time: str = Field("14:00", description="Start time e.g. 2:00 PM")
    end_time: str = Field("16:00", description="End time e.g. 4:00 PM")
    average_aqi: int = Field(..., description="Average AQI during this window")
    category: AqiCategory
    reason: str = Field(..., description="Why this window is safest (e.g. sunlight dispersal)")


class ForecastResponse(BaseModel):
    hourly: List[HourlyForecastPoint]
    safe_window: SafeWindow
    caution_note: str = Field(..., description="e.g. Avoid morning walks before 11 AM")
