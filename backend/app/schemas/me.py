from pydantic import BaseModel

from app.schemas.enums import PrimaryGoal, QuoteLength, Tone


class UserPreferences(BaseModel):
    primary_goal: PrimaryGoal
    tone: Tone
    quote_length: QuoteLength = QuoteLength.short
    allow_spiritual: bool = False


class MeResponse(BaseModel):
    id: str
    email: str | None = None
    preferences: UserPreferences | None = None
