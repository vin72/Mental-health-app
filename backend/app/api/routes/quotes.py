from fastapi import APIRouter, Depends
from fastapi.concurrency import run_in_threadpool

from app.repositories.quote_repository import QuoteRepository
from app.schemas.quote import QuoteGenerateRequest, QuoteResponse
from app.services.auth_service import get_current_user
from app.services.quote_service import QuoteService

router = APIRouter(prefix='/quotes', tags=["quotes"])
quote_service = QuoteService()
quote_repo = QuoteRepository()


@router.post('/generate', response_model=QuoteResponse)
async def generate_quote(payload: QuoteGenerateRequest, user: dict = Depends(get_current_user)) -> QuoteResponse:
    data = await run_in_threadpool(quote_service.generate, user['id'], payload)
    return QuoteResponse(**data)


@router.get('/history', response_model=list[QuoteResponse])
async def history(user: dict = Depends(get_current_user)) -> list[QuoteResponse]:
    return [QuoteResponse(**item) for item in quote_repo.list_history(user['id'])]


@router.get('/favorites', response_model=list[QuoteResponse])
async def favorites(user: dict = Depends(get_current_user)) -> list[QuoteResponse]:
    return [QuoteResponse(**item) for item in quote_repo.list_favorites(user['id'])]


@router.post('/{quote_id}/favorite')
async def favorite(quote_id: str, user: dict = Depends(get_current_user)) -> dict[str, bool]:
    quote_repo.favorite_quote(user['id'], quote_id)
    return {"success": True}
