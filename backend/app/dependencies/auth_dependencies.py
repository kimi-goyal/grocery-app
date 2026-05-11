from app.config.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status
from app.config.security import decode_access_token

security = HTTPBearer()

# Dependency to get current user from access token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    return decode_access_token(credentials.credentials)