from fastapi import HTTPException

from app.core.config import settings
from app.core.logging import logger
from app.repositories.quote_repository import QuoteRepository
from app.repositories.user_repository import UserRepository
from app.schemas.me import UserPreferences
from app.schemas.quote import QuoteGenerateRequest, QuotePromptInput
from app.services.openai_service import OpenAIService
from app.services.prompt_builder import build_quote_prompt


class QuoteService:
    def __init__(self) -> None:
        self.user_repo = UserRepository()
        self.quote_repo = QuoteRepository()
        self.openai = OpenAIService()

    def _resolve_preferences(self, user_id: str) -> UserPreferences:
        prefs = self.user_repo.get_preferences(user_id)
        if prefs:
            return prefs
        return UserPreferences(primary_goal="discipline", tone="practical", quote_length="short", allow_spiritual=False)

    def generate(self, user_id: str, payload: QuoteGenerateRequest) -> dict:
        logger.info("generation_attempt", extra={"user_id": user_id, "category": payload.category})
        # TODO: swap placeholder checks for real distributed rate-limiting and subscription quotas.
        daily_quota_remaining = 20
        if daily_quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="Daily quota exceeded")

        prefs = self._resolve_preferences(user_id)
        prompt_input = QuotePromptInput(preferences=prefs, category=payload.category, mood=payload.mood, context=payload.context)
        system_prompt, user_prompt = build_quote_prompt(prompt_input)
        quote_text = self.openai.generate_quote(system_prompt, user_prompt)
        if not quote_text:
            logger.error("generation_failed_empty", extra={"user_id": user_id})
            raise HTTPException(status_code=502, detail="Quote generation failed")

        return self.quote_repo.create_quote(
            user_id=user_id,
            quote_text=quote_text,
            category=payload.category,
            model_name=settings.openai_model,
            prompt_context=payload.model_dump(),
        )
