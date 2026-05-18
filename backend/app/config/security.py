
# from datetime import datetime, timedelta
# from jose import jwt, JWTError
# from passlib.context import CryptContext
# from fastapi import HTTPException, status
# from app.config.settings import settings

# pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)

# def create_access_token(data: dict) -> str:
#     payload = data.copy()
#     payload["exp"] = datetime.utcnow() + timedelta(
#         minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
#     )
#     return jwt.encode(payload, settings.SECRET_KEY, settings.ALGORITHM)

# def create_refresh_token(data: dict) -> str:
#     payload = data.copy()
#     payload["exp"] = datetime.utcnow() + timedelta(
#         days=settings.REFRESH_TOKEN_EXPIRE_DAYS
#     )
#     secret = getattr(settings, "REFRESH_SECRET_KEY", settings.SECRET_KEY)
#     return jwt.encode(payload, secret, settings.ALGORITHM)

# def decode_refresh_token(token: str) -> dict:
#     try:
#         return jwt.decode(
#             token,
#             settings.REFRESH_SECRET_KEY,
#             algorithms=[settings.ALGORITHM],
#         )
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid or expired refresh token",
#         )

# def decode_access_token(token: str) -> dict:
#     try:
#         return jwt.decode(
#             token,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM],
#         )
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid or expired access token",
#         )
    

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.settings import settings


# ✅ Use argon2 but fallback safe
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

bearer_scheme = HTTPBearer()


# ================= PASSWORD =================
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ================= TOKENS (KEEP OLD WORKING) =================

def create_access_token(payload: Dict[str, Any]) -> str:
    data = payload.copy()
    data["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    data["type"] = "access"

    return jwt.encode(
        data,
        getattr(settings, "SECRET_KEY", settings.SECRET_KEY),
        algorithm=getattr(settings, "ALGORITHM", settings.ALGORITHM),
    )


def create_refresh_token(payload: Dict[str, Any]) -> str:
    data = payload.copy()
    data["exp"] = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    data["type"] = "refresh"

    return jwt.encode(
        data,
        getattr(settings, "REFRESH_SECRET_KEY", settings.SECRET_KEY),
        algorithm=getattr(settings, "ALGORITHM", settings.ALGORITHM),
    )


# ================= NEW DECODE METHODS =================

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(
            token,
            getattr(settings, "SECRET_KEY", settings.SECRET_KEY),
            algorithms=[getattr(settings, "ALGORITHM", settings.ALGORITHM)],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )


def decode_refresh_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(
            token,
            getattr(settings, "REFRESH_SECRET_KEY", settings.SECRET_KEY),
            algorithms=[getattr(settings, "ALGORITHM", settings.ALGORITHM)],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )


# ✅ OLD FUNCTION KEPT (NO BREAKING CHANGE)
def decode_token(token: str) -> Dict[str, Any]:
    return decode_access_token(token)


# ================= DEPENDENCIES =================

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> int:
    payload = decode_access_token(credentials.credentials)

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type.")

    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token missing user_id.")

    try:
        return int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid user_id in token.")


def get_current_role(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    payload = decode_access_token(credentials.credentials)
    return payload.get("role", "user")