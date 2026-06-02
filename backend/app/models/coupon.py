
import uuid 
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, Integer, Boolean,
    DateTime, Enum, Text, ForeignKey, func
)
from sqlalchemy.orm import relationship
import enum
from app.config.database import Base


class DiscountType(str, enum.Enum):
    percentage = "percentage"
    flat = "flat"


class CouponTargetType(str, enum.Enum):
    all = "all" # everyone
    new_user = "new_user" # only first-time users
    specific = "specific" # specific user_ids via CouponAssignment


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(150), nullable=False) # "Get 20% off on your order"
    description = Column(Text, nullable=True)
    discount = Column(Float, nullable=False)
    type = Column(Enum(DiscountType), nullable=False)
    min_order = Column(Float, default=0.0)
    max_discount = Column(Float, default=0.0)
    usage_limit = Column(Integer, default=0) # 0 = unlimited
    used_count = Column(Integer, default=0)
    expiry = Column(DateTime(timezone=True), nullable=False)
    active = Column(Boolean, default=True)
    target_type = Column(Enum(CouponTargetType), default=CouponTargetType.all)
    push_notify = Column(Boolean, default=False) # send push on creation
    notify_before_expiry_hours = Column(Integer, default=24) # send expiry warning N hrs before
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    assignments = relationship("CouponAssignment", back_populates="coupon", cascade="all, delete-orphan")
    usages = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan")
    notifications = relationship("CouponNotification", back_populates="coupon", cascade="all, delete-orphan")


class CouponAssignment(Base):
    """Links a specific coupon to a specific user (for target_type=specific)."""
    __tablename__ = "coupon_assignments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    coupon_id = Column(String, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    coupon = relationship("Coupon", back_populates="assignments")


class CouponUsage(Base):
    """Tracks per-user coupon usage — prevents double-dipping."""
    __tablename__ = "coupon_usages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    coupon_id = Column(String, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(String, nullable=True)
    used_at = Column(DateTime(timezone=True), server_default=func.now())

    coupon = relationship("Coupon", back_populates="usages")


class CouponNotification(Base):
    """Records every push notification sent for a coupon per user."""
    __tablename__ = "coupon_notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    coupon_id = Column(String, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(30), nullable=False) # "new_coupon" | "expiry_warning"
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)

    coupon = relationship("Coupon", back_populates="notifications")

