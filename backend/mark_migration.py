import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Mark the migration as applied
try:
    cursor.execute(
        "INSERT INTO alembic_version (version_num) VALUES ('b8db530b1397')"
    )
    conn.commit()
    print("✅ Migration marked as applied in database")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()
