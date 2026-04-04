import pytest
from pydantic import ValidationError

from app.schemas.quote import QuoteGenerateRequest


def test_generate_request_validation():
    valid = QuoteGenerateRequest(category='discipline', mood='overwhelmed', context='big deadline')
    assert valid.category == 'discipline'

    with pytest.raises(ValidationError):
        QuoteGenerateRequest(category='discipline', mood='')
