#!/usr/bin/env python
"""Fix alembic version table by clearing stuck migrations."""

from sqlalchemy import create_engine, text
from app.config.settings import settings

engine = create_engine(settings.DATABASE_URL)

try:
    with engine.connect() as conn:
        # Clear the alembic_version table
        conn.execute(text("DELETE FROM alembic_version"))
        conn.commit()
        print("✅ Cleared alembic_version table")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    engine.dispose()
