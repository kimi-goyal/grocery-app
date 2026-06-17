from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.order import OrderStatus


class OrderItemOut(BaseModel):
    id: str
    product_id: Optional[str]
    name: str
    price: float
    quantity: int
    unit: Optional[str]
    image_url: Optional[str]
    item_rating: Optional[float] = None

    model_config = {"from_attributes": True}


class DriverInfoOut(BaseModel):
    """Driver info for order details."""
    id: str
    name: str
    phone: str
    vehicle_number: Optional[str] = None
    vehicle_type: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: str
    order_number: str
    customer_name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    total_amount: float
    status: OrderStatus
    coupon_code: Optional[str] = None
    discount_amount: float
    delivery_fee: float
    payment_method: str
    payment_id: Optional[str] = None
    estimated_time: Optional[str] = None
    items: List[OrderItemOut] = []
    items_count: int = 0
    driver: Optional[DriverInfoOut] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_count(cls, order):
        d = cls.model_validate(order)
        d.items_count = len(order.items)
        return d


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderListItem(BaseModel):
    """Lighter shape for list view."""
    id: str
    order_number: str
    total_amount: float
    status: OrderStatus
    items_count: int
    payment_method: str
    is_rated: bool
    overall_rating: Optional[float] = None
    created_at: datetime
    items_preview: List[OrderItemOut] = []

    model_config = {"from_attributes": True}


class PaginatedOrders(BaseModel):
    orders: List[OrderListItem]
    total: int
    page: int
    pages: int


class RatingSubmit(BaseModel):
    overall_rating: float
    delivery_rating: Optional[float] = None
    quality_rating: Optional[float] = None
    packaging_rating: Optional[float] = None
    review_text: Optional[str] = None
    item_ratings: Optional[dict] = None  # { order_item_id: rating }

    @field_validator("overall_rating")
    @classmethod
    def valid_rating(cls, v: float) -> float:
        if not (1.0 <= v <= 5.0):
            raise ValueError("Rating must be between 1 and 5.")
        return round(v * 2) / 2  # round to nearest 0.5
 