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

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import logging
from pydantic import BaseModel

from app.dependencies.auth_dependencies import get_db, get_current_user
from app.repositories.user_repository import get_user_by_id
from app.services.auth_service import google_login_service, register_user, login_user, verify_otp, resend_otp_service
from app.schemas.auth_schema import (
    UserRegister,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    OTPVerifyRequest,
)
from app.middleware.limiter import limiter
from app.config.security import decode_refresh_token, create_access_token
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

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    data: UserLogin,
    db: Session = Depends(get_db),
):
    return login_user(db, data)


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest):
    payload = decode_refresh_token(data.refresh_token)

    return {
        "access_token": create_access_token(
            {
                "user_id": payload["user_id"],
                "role": payload["role"],
            }
        ),
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
def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout endpoint.

    JWT is stateless, so server cannot invalidate tokens.
    Client must delete access & refresh tokens.
    """
    return {
        "message": "Logged out successfully. Please delete tokens on client side.",
        "user_id": current_user["user_id"],
    }
@router.post("/google")
def google_login(data: dict, db: Session = Depends(get_db)):
    return google_login_service(db, data["id_token"])