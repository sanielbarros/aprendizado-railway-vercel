from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.routers import company

app = FastAPI(title=settings.app_name)

app.include_router(company.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}
