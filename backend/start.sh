#/usr/bin/env bash
#Exit on error
set -o errexit

if [ -z "$MIGRATION_DATABASE_URL" ]; then
    export MIGRATION_DATABASE_URL="$DATABASE_URL"
fi

alembic upgrade head

uvicorn app.main:app --host 0.0.0.0 --port 8000
