from starlette.middleware.base import BaseHTTPMiddleware


class DummyRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # TODO: replace with Redis-backed rate limiting.
        return await call_next(request)
