"""Google Gemini LLM Provider Implementation with Graceful Rule-Based Fallback."""

import json
from typing import Any, Dict, Optional

import httpx

from app.config import settings
from app.models.advice import AskResponse
from app.services.llm.base import LLMProvider
from app.services.llm.prompts import (
    SYSTEM_INSTRUCTION,
    build_ask_prompt,
    generate_rule_based_fallback,
)
from app.utils.cache import llm_cache
from app.utils.logging import logger


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key if api_key is not None else settings.GEMINI_API_KEY
        self.model = model if model is not None else settings.GEMINI_MODEL

    async def answer_question(
        self,
        sanitized_question: str,
        ground_truth_context: Dict[str, Any],
        language: str = "en",
        client: Optional[httpx.AsyncClient] = None,
    ) -> AskResponse:
        """Query Gemini API with strict JSON formatting or fall back gracefully."""
        # 1. Check TTL cache
        cache_key = f"llm:{ground_truth_context.get('category')}:{language}:{sanitized_question.lower()}"
        cached = llm_cache.get(cache_key)
        if cached is not None:
            return cached

        # 2. Check if API Key is configured
        if not self.api_key:
            logger.info("GEMINI_API_KEY not configured. Using rule-based offline coach mode.")
            fallback = generate_rule_based_fallback(
                sanitized_question=sanitized_question,
                ground_truth=ground_truth_context,
                language=language,
            )
            llm_cache.set(cache_key, fallback)
            return fallback

        # 3. Call Gemini REST endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        user_prompt = build_ask_prompt(sanitized_question, ground_truth_context, language)

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}],
                }
            ],
            "systemInstruction": {
                "role": "system",
                "parts": [{"text": SYSTEM_INSTRUCTION}],
            },
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 600,
                "responseMimeType": "application/json",
            },
        }

        own_client = client is None
        http_client = client if client is not None else httpx.AsyncClient(timeout=8.0)

        try:
            resp = await http_client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    first = candidates[0]
                    content = first.get("content", {}).get("parts", [{}])[0].get("text", "")
                    if content:
                        parsed = json.loads(content)
                        # Ensure verdict stays grounded in rule engine
                        expected_verdict = ground_truth_context.get("verdict", "be_careful")
                        parsed["verdict"] = expected_verdict
                        parsed["is_offline_fallback"] = False
                        parsed["language"] = language

                        # Validate with Pydantic
                        validated = AskResponse.model_validate(parsed)
                        llm_cache.set(cache_key, validated)
                        return validated

            logger.warning("Gemini API call failed with status %d: %s. Falling back to rule engine.", resp.status_code, resp.text[:200])
        except Exception as e:
            logger.warning("Gemini invocation encountered error: %s. Using rule-based offline fallback.", str(e))
        finally:
            if own_client:
                await http_client.aclose()

        # Fallback if call failed
        fallback_resp = generate_rule_based_fallback(
            sanitized_question=sanitized_question,
            ground_truth=ground_truth_context,
            language=language,
        )
        llm_cache.set(cache_key, fallback_resp)
        return fallback_resp


# Global default provider
llm_provider = GeminiProvider()
