from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.enums import Category
from app.schemas.me import UserPreferences


class QuoteGenerateRequest(BaseModel):
    category: Category
    mood: str = Field(min_length=1, max_length=120)
    context: str | None = Field(default=None, max_length=500)


class QuoteResponse(BaseModel):
    id: str
    quote_text: str
    category: str | None
    is_favorite: bool
    created_at: datetime


class QuotePromptInput(BaseModel):
    preferences: UserPreferences
    category: Category
    mood: str
    context: str | None = None
