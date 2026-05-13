# from pydantic import BaseModel
# from typing import List


# class OrderItemResponse(BaseModel):
#     product_id: int
#     quantity: int
#     price: float

#     class Config:
#         from_attributes = True


# class OrderResponse(BaseModel):
#     id: int
#     total_amount: float
#     status: str
#     items: List[OrderItemResponse]

#     class Config:
#         from_attributes = True


from pydantic import BaseModel, EmailStr 
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


