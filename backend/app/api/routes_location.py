"""Location Search Routes."""

from typing import List

from fastapi import APIRouter, Query

from app.services.geocoding import GeocodingResult, search_indian_locations

router = APIRouter(prefix="/api/location", tags=["location"])


@router.get("/search", response_model=List[GeocodingResult])
async def search_locations(
    q: str = Query("", min_length=0, max_length=100, description="City or locality query in India")
):
    """Search for locations across India or get popular chips."""
    return await search_indian_locations(q)
