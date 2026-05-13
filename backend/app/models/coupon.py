import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Enum, Text, func
import enum
from app.config.database import Base


class DiscountType(str, enum.Enum):
    percentage = "percentage"
    flat = "flat"


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    discount = Column(Float, nullable=False)
    type = Column(Enum(DiscountType), nullable=False)
    min_order = Column(Float, default=0.0)
    max_discount = Column(Float, default=0.0)
    usage_limit = Column(Integer, default=0)
    used_count = Column(Integer, default=0)
    expiry = Column(DateTime(timezone=True), nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
