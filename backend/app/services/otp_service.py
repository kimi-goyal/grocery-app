from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.otp_model import OTP
from app.repositories.user_repository import get_user_by_email, verify_user
from app.repositories.otp_repository import (
    create_otp,
    get_active_otp,
    mark_otp_used
)
from app.utils.otp_generator import generate_otp, verify_otp
from app.utils.email_handler import send_email


OTP_EXPIRY_MINUTES = 5


async def send_otp(
    db: Session,
    email: str,
    purpose: str
) -> None:
    user = get_user_by_email(db, email)
    if not user:
        raise ValueError("User not found")

    otp_plain, otp_hash = generate_otp()

    otp = OTP(
        user_id=user.id,
        otp_hash=otp_hash,
        purpose=purpose,
        expires_at=datetime.utcnow()
        + timedelta(minutes=OTP_EXPIRY_MINUTES),
    )

    create_otp(db, otp)
    await send_email(
        to_email=email,
        subject="Your OTP Code",
        plain_text=f"Your OTP code is {otp_plain}.\n\nUse this code within 5 minutes to complete your request."
    )


def verify_otp_code(
    db: Session,
    email: str,
    otp_input: str,
    purpose: str
) -> None:
    user = get_user_by_email(db, email)
    if not user:
        raise ValueError("User not found")

    otp_record = get_active_otp(db, user.id, purpose)
    if not otp_record:
        raise ValueError("OTP not found")

    if otp_record.expires_at < datetime.utcnow():
        raise ValueError("OTP expired")

    if not verify_otp(otp_input, otp_record.otp_hash):
        raise ValueError("Invalid OTP")

    mark_otp_used(db, otp_record)

    if purpose == "register":
        verify_user(db, user)
