from fastapi import APIRouter, Depends

from app.repositories.user_repository import UserRepository
from app.schemas.me import MeResponse, UserPreferences
from app.services.auth_service import get_current_user

router = APIRouter(tags=["me"])
user_repo = UserRepository()


@router.get('/me', response_model=MeResponse)
async def me(user: dict = Depends(get_current_user)) -> MeResponse:
    prefs = user_repo.get_preferences(user['id'])
    return MeResponse(id=user['id'], email=user.get('email'), preferences=prefs)


@router.put('/me/preferences', response_model=UserPreferences)
async def update_preferences(payload: UserPreferences, user: dict = Depends(get_current_user)) -> UserPreferences:
    return user_repo.upsert_preferences(user['id'], payload)
