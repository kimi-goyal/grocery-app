from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text
from app.config.database import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ Database connected")

    yield

    # Shutdown
    engine.dispose()
    print("🛑 App shutdown")