from openai import OpenAI

from app.core.config import settings


class OpenAIService:
    def __init__(self) -> None:
        self.client = OpenAI(api_key=settings.openai_api_key)

    def generate_quote(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.responses.create(
            model=settings.openai_model,
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            max_output_tokens=80,
        )
        text = response.output_text.strip()
        return text.replace('"', '')
