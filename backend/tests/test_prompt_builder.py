from app.schemas.me import UserPreferences
from app.schemas.quote import QuotePromptInput
from app.services.prompt_builder import build_quote_prompt


def test_prompt_builder_includes_guardrails():
    payload = QuotePromptInput(
        preferences=UserPreferences(primary_goal='fitness', tone='calm', quote_length='short', allow_spiritual=False),
        category='fitness',
        mood='tired',
        context='I skipped workouts last week',
    )

    system_prompt, user_prompt = build_quote_prompt(payload)
    assert 'Output only quote text' in system_prompt
    assert 'Do not include spiritual' in user_prompt
    assert 'Goal: fitness' in user_prompt
