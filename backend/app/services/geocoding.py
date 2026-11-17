"""Geocoding Service using Open-Meteo API restricted to India."""

from typing import List, Optional

import httpx
from pydantic import BaseModel

from app.config import settings
from app.utils.cache import geocoding_cache
from app.utils.logging import logger


class GeocodingResult(BaseModel):
    name: str
    state: str
    latitude: float
    longitude: float
    country: str = "India"
    display_name: str


POPULAR_INDIAN_LOCATIONS: List[GeocodingResult] = [
    GeocodingResult(
        name="Greater Kailash II, New Delhi",
        state="Delhi",
        latitude=28.5355,
        longitude=77.2410,
        display_name="South Delhi (GK-II)",
    ),
    GeocodingResult(
        name="Indiranagar, Bengaluru",
        state="Karnataka",
        latitude=12.9784,
        longitude=77.6408,
        display_name="Bengaluru (Indiranagar)",
    ),
    GeocodingResult(
        name="Bandra West, Mumbai",
        state="Maharashtra",
        latitude=19.0596,
        longitude=72.8295,
        display_name="Mumbai (Bandra)",
    ),
    GeocodingResult(
        name="Salt Lake, Kolkata",
        state="West Bengal",
        latitude=22.5868,
        longitude=88.4178,
        display_name="Kolkata (Salt Lake)",
    ),
    GeocodingResult(
        name="Mylapore, Chennai",
        state="Tamil Nadu",
        latitude=13.0368,
        longitude=80.2676,
        display_name="Chennai (Mylapore)",
    ),
    GeocodingResult(
        name="Gachibowli, Hyderabad",
        state="Telangana",
        latitude=17.4401,
        longitude=78.3489,
        display_name="Hyderabad (Gachibowli)",
    ),
    GeocodingResult(
        name="Kothrud, Pune",
        state="Maharashtra",
        latitude=18.5074,
        longitude=73.8077,
        display_name="Pune (Kothrud)",
    ),
    GeocodingResult(
        name="Gomti Nagar, Lucknow",
        state="Uttar Pradesh",
        latitude=26.8500,
        longitude=80.9980,
        display_name="Lucknow (Gomti Nagar)",
    ),
]


async def search_indian_locations(
    query: str, client: Optional[httpx.AsyncClient] = None
) -> List[GeocodingResult]:
    """Search for locations within India using Open-Meteo Geocoding API."""
    q = query.strip()
    if not q or len(q) < 2:
        return POPULAR_INDIAN_LOCATIONS

    cache_key = f"geo:{q.lower()}"
    cached = geocoding_cache.get(cache_key)
    if cached is not None:
        return cached

    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": q,
        "count": 8,
        "language": "en",
        "format": "json",
        "country_code": "IN",
    }

    results: List[GeocodingResult] = []
    own_client = client is None

    try:
        http_client = client if client is not None else httpx.AsyncClient(timeout=6.0)
        try:
            response = await http_client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                for item in data.get("results", []):
                    # Ensure within India
                    country_code = item.get("country_code", "").upper()
                    if country_code == "IN":
                        name = item.get("name", "")
                        admin1 = item.get("admin1", item.get("country", "India"))
                        lat = item.get("latitude")
                        lon = item.get("longitude")
                        display = f"{name}, {admin1}"
                        results.append(
                            GeocodingResult(
                                name=name,
                                state=admin1,
                                latitude=lat,
                                longitude=lon,
                                display_name=display,
                            )
                        )
        finally:
            if own_client:
                await http_client.aclose()
    except Exception as e:
        logger.warning("Geocoding lookup failed for query '%s': %s. Falling back to popular locations.", q, str(e))
        # Filter popular locations by matching text
        results = [
            loc for loc in POPULAR_INDIAN_LOCATIONS
            if q.lower() in loc.name.lower() or q.lower() in loc.state.lower()
        ]
        if not results:
            results = POPULAR_INDIAN_LOCATIONS[:4]

    if results:
        geocoding_cache.set(cache_key, results, ttl_seconds=settings.CACHE_TTL_GEOCODING_SECONDS)

    return results
