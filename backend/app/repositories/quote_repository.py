from app.db.supabase_client import get_admin_client


class QuoteRepository:
    def create_quote(self, user_id: str, quote_text: str, category: str, model_name: str, prompt_context: dict) -> dict:
        result = (
            get_admin_client()
            .table("generated_quotes")
            .insert({
                "user_id": user_id,
                "quote_text": quote_text,
                "category": category,
                "model_name": model_name,
                "prompt_context": prompt_context,
            })
            .execute()
        )
        return result.data[0]

    def list_history(self, user_id: str) -> list[dict]:
        result = get_admin_client().table("generated_quotes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data

    def list_favorites(self, user_id: str) -> list[dict]:
        result = get_admin_client().table("generated_quotes").select("*").eq("user_id", user_id).eq("is_favorite", True).order("created_at", desc=True).execute()
        return result.data

    def favorite_quote(self, user_id: str, quote_id: str) -> None:
        get_admin_client().table("generated_quotes").update({"is_favorite": True}).eq("id", quote_id).eq("user_id", user_id).execute()
