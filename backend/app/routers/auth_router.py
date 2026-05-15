# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app.schemas.user_schema import UserCreate
# from app.schemas.auth_schema import LoginRequest
# from app.services.auth_service import register_user, login_user
# from app.dependencies.auth_dependencies import get_db

# router = APIRouter(
#     prefix="/auth",
#     tags=["Auth"]
# )


# @router.post(
#     "/register",
#     status_code=status.HTTP_201_CREATED
# )
# def register(
#     payload: UserCreate,
#     db: Session = Depends(get_db)
# ):
#     try:
#         user = register_user(
#             db=db,
#             name=payload.name,
#             email=payload.email,
#             password=payload.password
#         )
#         return {
#             "message": "User registered successfully. Please verify OTP.",
#             "user_id": user.id
#         }
#     except ValueError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=str(e)
#         )


# @router.post("/login")
# def login(
#     payload: LoginRequest,
#     db: Session = Depends(get_db)
# ):
#     try:
#         token = login_user(
#             db=db,
#             email=payload.email,
#             password=payload.password
#         )
#         return {
#             "access_token": token,
#             "token_type": "bearer"
#         }
#     except ValueError as e:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=str(e)
#         )

from typing import Optional

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
import logging
from pydantic import BaseModel

from app.dependencies.auth_dependencies import get_db, get_current_user
from app.repositories.user_repository import get_user_by_id
from app.services.auth_service import google_login_service, register_user, login_user, admin_login_user, verify_otp, resend_otp_service
from app.schemas.auth_schema import (
    UserRegister,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    OTPVerifyRequest,
)
from app.middleware.limiter import limiter
from app.config.security import decode_refresh_token, create_access_token, create_refresh_token
from app.config.settings import settings
from fastapi import status

logger = logging.getLogger(__name__)

class EmailRequest(BaseModel):
    email: str

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

@router.post("/register")
@limiter.limit("3/minute")
def register(
    request: Request,
    data: UserRegister,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(db, data)
        return {
            "message": "User registered successfully",
            "username": user.username,
            "email": user.email,
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise


@router.post("/resend-otp")
@limiter.limit("3/minute")
def resend_otp(
    request: Request,
    data: EmailRequest,
    db: Session = Depends(get_db),
):
    """Resend OTP for unverified users"""
    try:
        resend_otp_service(db, data.email)
        return {"message": "OTP sent successfully"}
    except Exception as e:
        logger.error(f"Resend OTP error: {str(e)}")
        raise


from app.services.auth_service import verify_otp_service

@router.post("/verify-otp")
def verify(data: OTPVerifyRequest, db: Session = Depends(get_db)):
    return verify_otp_service(db, data.email, data.otp)

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    response: Response,
    data: UserLogin,
    db: Session = Depends(get_db),
):
    tokens = login_user(db, data)
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return tokens


@router.post("/admin-login", response_model=TokenResponse)
@limiter.limit("5/minute")
def admin_login(
    request: Request,
    response: Response,
    data: UserLogin,
    db: Session = Depends(get_db),
):
    tokens = admin_login_user(db, data)
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return tokens


@router.post("/refresh", response_model=TokenResponse)
def refresh(
    request: Request,
    response: Response,
    data: Optional[RefreshRequest] = None,
):
    refresh_token = None
    if data and getattr(data, "refresh_token", None):
        refresh_token = data.refresh_token
    else:
        refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = decode_refresh_token(refresh_token)
    access_token = create_access_token(
        {
            "user_id": payload["user_id"],
            "role": payload["role"],
        }
    )
    refresh_token = create_refresh_token(
        {
            "user_id": payload["user_id"],
            "role": payload["role"],
        }
    )
    set_auth_cookies(response, access_token, refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Protected endpoint that requires a valid access token"""
    user = get_user_by_id(db, current_user["user_id"])
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "is_verified": user.is_verified,
    }


@router.get("/admin")
def admin_only(current_user: dict = Depends(get_current_user)):
    """Admin-only protected endpoint"""
    if current_user["role"] != "admin":
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return {
        "message": "Welcome to admin panel",
        "user_id": current_user["user_id"],
        "role": current_user["role"]
    }


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response, current_user: dict = Depends(get_current_user)):
    """
    Logout endpoint.

    Clear auth cookies on the server side.
    """
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {
        "message": "Logged out successfully.",
        "user_id": current_user["user_id"],
    }
@router.post("/google", response_model=TokenResponse)
def google_login(response: Response, data: dict, db: Session = Depends(get_db)):
    tokens = google_login_service(db, data["id_token"])
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return tokens