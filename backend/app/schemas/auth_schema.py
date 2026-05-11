# from pydantic import BaseModel, EmailStr


# class LoginRequest(BaseModel):
#     email: EmailStr
#     password: str

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

# ---------- REGEX RULES ----------
USERNAME_REGEX = r"^[a-zA-Z0-9_]{4,}$"
PASSWORD_REGEX = r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"

# ---------- REGISTER ----------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str
    

    @field_validator("name")
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters long")
        if not v.replace(" ", "").isalpha():
            raise ValueError("Name can contain only letters")
        return v

    @field_validator("username")
    def validate_username(cls, v):
        if not re.match(USERNAME_REGEX, v):
            raise ValueError(
                "Username must be 4+ characters and contain only letters, numbers or underscore"
            )
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError(
                "Password must be at least 8 characters and include one letter and one number"
            )
        return v


# ---------- LOGIN ----------
class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator("username")
    def validate_login_username(cls, v):
        if not v.strip():
            raise ValueError("Username is required")
        return v

    @field_validator("password")
    def validate_login_password(cls, v):
        if not v:
            raise ValueError("Password is required")
        return v


# ---------- TOKEN ----------
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ---------- OTP ----------
class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


# ---------- REFRESH ----------
class RefreshRequest(BaseModel):
    refresh_token: str