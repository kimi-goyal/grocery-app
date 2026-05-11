from pydantic import BaseModel
from typing import List


class CartAddRequest(BaseModel):
    product_id: int
    quantity: int


class CartItemResponse(BaseModel):
    product_id: int
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]