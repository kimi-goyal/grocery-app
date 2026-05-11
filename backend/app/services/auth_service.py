# from sqlalchemy.orm import Session
# from app.models.user_model import User
# from app.repositories.user_repository import (
#     get_user_by_email,
#     create_user,
#     verify_user
# )
# from app.utils.password_handler import hash_password, verify_password
# from app.utils.jwt_handler import create_access_token


# def register_user(db: Session, name: str, email: str, password: str) -> User:
#     if get_user_by_email(db, email):
#         raise ValueError("User already exists")

#     user = User(
#         name=name,
#         email=email,
#         password_hash=hash_password(password),
#         role="customer"
#     )

#     return create_user(db, user)


# def login_user(db: Session, email: str, password: str) -> str:
#     user = get_user_by_email(db, email)
#     if not user:
#         raise ValueError("Invalid credentials")

#     if not verify_password(password, user.password_hash):
#         raise ValueError("Invalid credentials")

#     if not user.is_verified:
#         raise ValueError("User not verified")

#     token = create_access_token(
#         {"user_id": user.id, "role": user.role}
#     )
#     return token
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repositories.user_repository import (
    get_user_by_email,
    get_user_by_username,
    get_user_by_identifier,
    create_user,
)
from app.utils.password_handler import hash_password, verify_password
from app.utils.jwt_handler import (
    create_access_token,
    create_refresh_token,
)
from app.utils.otp_generator import generate_otp
from app.utils.email_handler import send_email
from app.schemas.auth_schema import UserLogin, UserRegister

pending_otps: dict[str, str] = {}

def register_user(db: Session, data: UserRegister):
    email = data.email.lower()

    existing = get_user_by_email(db, email)
    if existing and existing.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if existing and not existing.is_verified:
        db.delete(existing)
        db.commit()

    user = User(
        name=data.name,
        email=email,
        username=data.username,
        password_hash=hash_password(data.password),
        role="user",  # ✅ DEFAULT ROLE SET HERE
        is_verified=False
    )

    create_user(db, user)

    otp = generate_otp()
    pending_otps[email] = otp

    send_email(
        to_email=email,
        subject="Verify your account",
        plain_text=f"Your OTP is: {otp}"
    )

    return user

def login_user(db: Session, data: UserLogin):
    user = get_user_by_identifier(db, data.username)

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
        )

    payload = {
        "user_id": user.id,
        "role": user.role,
    }

    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
        "token_type": "bearer",
    }

def verify_otp(db: Session, email: str, otp: str) -> None:
    normalized_email = email.strip().lower()
    stored = pending_otps.get(normalized_email)
    if not stored or stored != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    user = get_user_by_email(db, normalized_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_verified = True
    db.add(user)
    db.commit()
    db.refresh(user)

    pending_otps.pop(normalized_email, None)  # Fixed: use normalized_email instead of email

def resend_otp_service(db: Session, email: str) -> None:
    """Resend OTP to unverified user"""
    normalized_email = email.strip().lower()
    
    user = get_user_by_email(db, normalized_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already verified",
        )
    
    otp = generate_otp()
    pending_otps[normalized_email] = otp
    
    send_email(
        to_email=normalized_email,
        subject="Verify your account",
        plain_text=f"Your OTP is: {otp}"
    )

