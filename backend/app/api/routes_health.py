"""Health and Readiness Check Route."""

from fastapi import APIRouter

from app.config import settings

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("")
async def health_check():
    """Health status and configuration readiness check."""
    return {
        "status": "healthy",
        "app": "Zephyre Air Quality Coach",
        "environment": settings.ENVIRONMENT,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "gemini_model": settings.GEMINI_MODEL,
        "waqi_configured": bool(settings.WAQI_TOKEN),
        "demo_mode": settings.DEMO_MODE,
    }
