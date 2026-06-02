from sqlalchemy.orm import Session
from app.models.otp_model import OTP


def create_otp(db: Session, otp: OTP) -> OTP:
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return otp


def get_active_otp(
    db: Session,
    user_id: int,
    purpose: str
) -> OTP | None:
    return (
        db.query(OTP)
        .filter(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.is_used == False
        )
        .order_by(OTP.created_at.desc())
        .first()
    )


def mark_otp_used(db: Session, otp: OTP) -> None:
    otp.is_used = True
    db.commit()
