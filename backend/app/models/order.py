import uuid
from sqlalchemy import (
    Column, String, Float, Integer,
    ForeignKey, Text, DateTime, Enum, func, Boolean
)
from sqlalchemy.orm import relationship
import enum
from app.config.database import Base
 
 
 
class OrderStatus(str, enum.Enum):
    pending = "Pending"
    packed = "Packed"
    on_the_way = "On the Way"
    delivered = "Delivered"
    cancelled = "Cancelled"
 
 
class Order(Base):
    __tablename__ = "orders"
 
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    driver_id = Column(String, ForeignKey("drivers.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending, nullable=False)
    coupon_code = Column(String(50), nullable=True)
    discount_amount = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    payment_method = Column(String(20), default="cod") # razorpay | cod
    payment_id = Column(String(100), nullable=True) # Razorpay payment_id
    notes = Column(Text, nullable=True)
    estimated_time = Column(String(50), default="10 minutes")
 
    # ── Rating fields ─────────────────────────────────────────────────────
    is_rated = Column(Boolean, default=False)
    overall_rating = Column(Float, nullable=True) # 1–5
    delivery_rating = Column(Float, nullable=True)
    quality_rating = Column(Float, nullable=True)
    packaging_rating = Column(Float, nullable=True)
    review_text = Column(Text, nullable=True)
    rated_at = Column(DateTime(timezone=True), nullable=True)
 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
 
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    user = relationship("User")
    driver = relationship("Driver", back_populates="orders")
 
 
class OrderItem(Base):
    __tablename__ = "order_items"
 
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String(30), nullable=True)
    image_url = Column(String(500), nullable=True)
 
    # Per-item rating (optional granular feedback)
    item_rating = Column(Float, nullable=True)
 
    order = relationship("Order", back_populates="items")
    product = relationship("Product")