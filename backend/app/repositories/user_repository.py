from app.db.supabase_client import get_admin_client
from app.schemas.me import UserPreferences


class UserRepository:
    def get_preferences(self, user_id: str) -> UserPreferences | None:
        result = get_admin_client().table("user_preferences").select("*").eq("user_id", user_id).maybe_single().execute()
        if not result.data:
            return None
        return UserPreferences(**result.data)

    def upsert_preferences(self, user_id: str, preferences: UserPreferences) -> UserPreferences:
        payload = {"user_id": user_id, **preferences.model_dump()}
        get_admin_client().table("user_preferences").upsert(payload).execute()
        return preferences
