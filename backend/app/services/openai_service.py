from fastapi import HTTPException
from openai import OpenAI

from app.core.config import get_settings


class OpenAIService:
    def __init__(self) -> None:
        self.client: OpenAI | None = None

    def _client(self) -> OpenAI:
        if self.client:
            return self.client
        api_key = get_settings().openai_api_key
        if not api_key:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured on the backend")
        self.client = OpenAI(api_key=api_key)
        return self.client

    def generate_quote(self, system_prompt: str, user_prompt: str) -> str:
        response = self._client().responses.create(
            model=get_settings().openai_model,
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            max_output_tokens=80,
        )
        text = response.output_text.strip()
        return text.replace('"', '')
