import uuid
from sqlalchemy import Column, String, Boolean, Float, ForeignKey, DateTime, func, Integer
from app.config.database import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tag = Column(String(20), default="Home") # Home | Work | Other
    name = Column(String(100), nullable=False)
    line1 = Column(String(300), nullable=False)
    line2 = Column(String(300), nullable=True)
    phone = Column(String(20), nullable=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())



