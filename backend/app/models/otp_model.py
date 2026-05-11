from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey
)
from datetime import datetime

from app.config.database import Base


class OTP(Base):
    __tablename__ = "otp"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    otp_hash = Column(String, nullable=False)

    purpose = Column(String(50), nullable=False)
    # examples: "register", "login", "reset_password"

    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)