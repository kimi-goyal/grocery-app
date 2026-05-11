from pydantic import BaseModel
from typing import List


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True