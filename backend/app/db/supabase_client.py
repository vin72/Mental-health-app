from fastapi import HTTPException
from supabase import Client, create_client

from app.core.config import get_settings


def get_admin_client() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing on the backend")
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
