from app.schemas.quote import QuotePromptInput


def build_quote_prompt(data: QuotePromptInput) -> tuple[str, str]:
    length_hint = "under 18 words" if data.preferences.quote_length == "short" else "18-35 words"
    spiritual_rule = "Spiritual framing is allowed." if data.preferences.allow_spiritual else "Do not include spiritual or religious framing."
    system_prompt = (
        "You write exactly one motivational quote. Output only quote text. "
        "No hashtags. No emojis. Avoid cliches and abusive motivation. "
        "Do not provide diagnosis, therapy, or medical advice. Do not mention AI."
    )
    user_prompt = (
        f"Goal: {data.preferences.primary_goal}. Tone: {data.preferences.tone}. "
        f"Length: {data.preferences.quote_length} ({length_hint}). Category: {data.category}. Mood: {data.mood}. "
        f"Context: {data.context or 'none'}. {spiritual_rule}"
    )
    return system_prompt, user_prompt
