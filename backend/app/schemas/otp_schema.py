from pydantic import BaseModel, EmailStr


class SendOtpRequest(BaseModel):
    email: EmailStr
    purpose: str   # register | login | reset_password


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str
    purpose: str