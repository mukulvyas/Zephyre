"""LLM Provider Abstract Base Class."""

from abc import ABC, abstractmethod
from typing import Any, Dict

from app.models.advice import AskResponse


class LLMProvider(ABC):
    """Abstract interface for GenAI LLM providers."""

    @abstractmethod
    async def answer_question(
        self,
        sanitized_question: str,
        ground_truth_context: Dict[str, Any],
        language: str = "en",
    ) -> AskResponse:
        """Answer a user question constrained strictly by the ground-truth context."""
        pass
