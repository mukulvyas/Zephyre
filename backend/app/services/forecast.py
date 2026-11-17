"""Hourly Air Quality Forecast Service.

Generates 24-hour forecast from Open-Meteo Air Quality API (or synthesized curves)
and calculates the safest outdoor window.
"""

from datetime import datetime
from typing import List, Optional

import httpx

from app.core.aqi_cpcb import calculate_cpcb_aqi, get_aqi_category
from app.core.routine_planner import find_safest_outdoor_window
from app.models.aqi import ForecastResponse, HourlyForecastPoint
from app.utils.logging import logger


async def get_hourly_forecast(
    latitude: float,
    longitude: float,
    client: Optional[httpx.AsyncClient] = None,
) -> ForecastResponse:
    """Fetch 24-hour hourly forecast and compute safest window."""
    points: List[HourlyForecastPoint] = []
    own_client = client is None

    try:
        http_client = client if client is not None else httpx.AsyncClient(timeout=6.0)
        try:
            url = "https://air-quality-api.open-meteo.com/v1/air-quality"
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "hourly": "pm2_5,pm10",
                "forecast_days": 1,
            }
            resp = await http_client.get(url, params=params)
            if resp.status_code == 200:
                data = resp.json()
                hourly = data.get("hourly", {})
                times = hourly.get("time", [])
                pm25_list = hourly.get("pm2_5", [])
                pm10_list = hourly.get("pm10", [])

                for i in range(min(24, len(times))):
                    t_str = times[i]
                    # Parse hour
                    try:
                        dt = datetime.fromisoformat(t_str)
                        hr = dt.hour
                    except Exception:
                        hr = i

                    pm25_val = float(pm25_list[i]) if i < len(pm25_list) and pm25_list[i] is not None else 80.0
                    pm10_val = float(pm10_list[i]) if i < len(pm10_list) and pm10_list[i] is not None else None
                    aqi_val, _ = calculate_cpcb_aqi(pm25=pm25_val, pm10=pm10_val)

                    points.append(
                        HourlyForecastPoint(
                            time=f"{hr:02d}:00",
                            hour=hr,
                            aqi=aqi_val,
                            category=get_aqi_category(aqi_val),
                            pm25=pm25_val,
                            is_safest_window=False,
                        )
                    )
        finally:
            if own_client:
                await http_client.aclose()
    except Exception as e:
        logger.warning("Forecast fetch failed: %s. Using standard daily diurnal curve.", str(e))

    # If API call returned no points, generate realistic diurnal curve for Indian winter smog
    if not points:
        # Typical diurnal cycle: Peak early morning (410 AQI at 8 AM), dip in afternoon (260 at 3 PM), rise at evening (380 at 9 PM)
        diurnal_weights = [
            (0, 360), (3, 380), (6, 400), (8, 410), (10, 390), (12, 320),
            (14, 270), (15, 260), (16, 275), (18, 310), (20, 370), (22, 380)
        ]
        hour_map = dict(diurnal_weights)
        for h in range(24):
            # approximate nearest key
            closest_h = min(hour_map.keys(), key=lambda k: abs(k - h))
            aqi_val = hour_map[closest_h]
            points.append(
                HourlyForecastPoint(
                    time=f"{h:02d}:00",
                    hour=h,
                    aqi=aqi_val,
                    category=get_aqi_category(aqi_val),
                    pm25=round(aqi_val * 0.75, 1),
                    is_safest_window=False,
                )
            )

    safe_window, caution = find_safest_outdoor_window(points)

    return ForecastResponse(
        hourly=points,
        safe_window=safe_window,
        caution_note=caution,
    )
