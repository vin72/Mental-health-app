from fastapi import FastAPI

from app.api.routes import health, me, quotes
from app.middleware.rate_limit import DummyRateLimitMiddleware

app = FastAPI(title="Motivation API", version="0.1.0")
app.add_middleware(DummyRateLimitMiddleware)

app.include_router(health.router)
app.include_router(me.router)
app.include_router(quotes.router)
