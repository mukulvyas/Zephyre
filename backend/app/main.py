"""Zephyre FastAPI Main Application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api import (
    routes_advice,
    routes_aqi,
    routes_health,
    routes_impact,
    routes_location,
)
from app.config import settings
from app.utils.logging import logger

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Zephyre backend starting up. Environment: %s", settings.ENVIRONMENT)
    if settings.GEMINI_API_KEY:
        logger.info("Gemini GenAI active with model: %s", settings.GEMINI_MODEL)
    else:
        logger.info("No GEMINI_API_KEY detected. Running in offline rule-based coach mode.")
    yield
    logger.info("Zephyre backend shutting down.")


app = FastAPI(
    title="Zephyre Air Quality Coach API",
    description="A weather app for your lungs. Low-emission daily routines and explainable clean-air impact.",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Cap request body size (1 MB max)
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > 1_000_000:
        return JSONResponse(status_code=413, content={"detail": "Request body too large"})

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(self)"
    return response


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error processing %s: %s", request.url.path, str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Safe default data is preserved."},
    )


# Include API Routers
app.include_router(routes_health.router)
app.include_router(routes_location.router)
app.include_router(routes_aqi.router)
app.include_router(routes_advice.router)
app.include_router(routes_impact.router)


@app.get("/")
async def root():
    return {
        "message": "Zephyre Air Quality Coach API is active.",
        "docs": "/docs",
        "health": "/api/health",
    }
