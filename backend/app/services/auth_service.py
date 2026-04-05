from fastapi import Header, HTTPException

from app.db.supabase_client import get_admin_client


async def get_current_user(authorization: str = Header(default="")) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.replace("Bearer ", "", 1)
    user_response = get_admin_client().auth.get_user(token)
    user = user_response.user
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"id": user.id, "email": user.email}
