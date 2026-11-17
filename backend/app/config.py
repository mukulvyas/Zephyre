"""Application Settings via Pydantic-Settings."""

from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    ENVIRONMENT: str = "development"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # Gemini GenAI
    GEMINI_API_KEY: str = Field("", description="Google Gemini API Key")
    GEMINI_MODEL: str = Field("gemini-2.0-flash", description="Fast Gemini model name")

    # Air Quality Data
    WAQI_TOKEN: str = Field("", description="World Air Quality Index Token (optional)")

    # Demo Mode: Allows forced test conditions for evaluations and presentations
    DEMO_MODE: bool = False
    DEMO_AQI_CITY: str = ""  # e.g. "delhi" (severe) or "bengaluru" (satisfactory)

    # Rate Limiting & TTL Cache
    RATE_LIMIT_PER_MINUTE: int = 60
    CACHE_TTL_AQI_SECONDS: int = 900       # 15 minutes
    CACHE_TTL_GEOCODING_SECONDS: int = 86400  # 24 hours
    CACHE_TTL_LLM_SECONDS: int = 600       # 10 minutes

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
