"""In-Memory TTL Cache with hit/miss tracking."""

import time
from typing import Any, Dict, Optional, Tuple

from app.utils.logging import logger


class TTLCache:
    def __init__(self, default_ttl_seconds: int = 900):
        self._cache: Dict[str, Tuple[float, Any]] = {}
        self._default_ttl = default_ttl_seconds
        self._hits = 0
        self._misses = 0

    def get(self, key: str) -> Optional[Any]:
        now = time.time()
        item = self._cache.get(key)
        if item is None:
            self._misses += 1
            return None

        expiry, value = item
        if now > expiry:
            del self._cache[key]
            self._misses += 1
            return None

        self._hits += 1
        logger.debug("Cache hit for key: %s (hits=%d, misses=%d)", key, self._hits, self._misses)
        return value

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        expiry = time.time() + ttl
        self._cache[key] = (expiry, value)

    def clear(self) -> None:
        self._cache.clear()

    @property
    def stats(self) -> dict:
        return {
            "size": len(self._cache),
            "hits": self._hits,
            "misses": self._misses,
        }


# Global caches
aqi_cache = TTLCache(default_ttl_seconds=900)        # 15 minutes
geocoding_cache = TTLCache(default_ttl_seconds=86400) # 24 hours
llm_cache = TTLCache(default_ttl_seconds=600)         # 10 minutes
