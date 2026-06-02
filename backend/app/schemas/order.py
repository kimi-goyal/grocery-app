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
    coupon_code: Optional[str]
    discount_amount: float
    delivery_fee: float
    notes: Optional[str]
    items: List[OrderItemOut] = []
    items_count: int
    created_at: datetime
    updated_at: Optional[datetime]
 
    model_config = {"from_attributes": True}
 
    @classmethod
    def from_orm_with_count(cls, order):
        d = cls.model_validate(order)
        d.items_count = len(order.items)
        return d
 
 
class OrderStatusUpdate(BaseModel):
    status: OrderStatus
 
 
class OrderListOut(BaseModel):
    id: str
    order_number: str
    customer_name: str
    email: str
    phone: Optional[str]
    total_amount: float
    status: OrderStatus
    items_count: int
    created_at: datetime
 
    model_config = {"from_attributes": True}
 
 
class PaginatedOrders(BaseModel):
    orders: List[OrderListOut]
    total: int
    page: int
    pages: int
 
 
class OrderItemOut(BaseModel):
    id: str
    product_id: Optional[str]
    name: str
    price: float
    quantity: int
    unit: Optional[str]
    image_url: Optional[str]
    item_rating: Optional[float]
 
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
    coupon_code: Optional[str]
    discount_amount: float
    delivery_fee: float
    payment_method: str
    payment_id: Optional[str]
    estimated_time: Optional[str]
    items: List[OrderItemOut] = []
    items_count: int = 0
 
    # Rating
    is_rated: bool
    overall_rating: Optional[float]
    delivery_rating: Optional[float]
    quality_rating: Optional[float]
    packaging_rating: Optional[float]
    review_text: Optional[str]
    rated_at: Optional[datetime]
 
    created_at: datetime
    updated_at: Optional[datetime]
 
    model_config = {"from_attributes": True}
 
 
class OrderListItem(BaseModel):
    """Lighter shape for list view."""
    id: str
    order_number: str
    total_amount: float
    status: OrderStatus
    items_count: int
    payment_method: str
    is_rated: bool
    overall_rating: Optional[float]
    created_at: datetime
    items_preview: List[OrderItemOut] = [] # first 2 items for thumbnail row
 
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
    item_ratings: Optional[dict] = None # { order_item_id: rating }
 
    @field_validator("overall_rating")
    @classmethod
    def valid_rating(cls, v: float) -> float:
        if not (1.0 <= v <= 5.0):
            raise ValueError("Rating must be between 1 and 5.")
        return round(v * 2) / 2 # round to nearest 0.5
 