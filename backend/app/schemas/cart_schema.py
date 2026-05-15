from pydantic import BaseModel
from typing import List


class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int


class UpdateCartRequest(BaseModel):
    product_id: str
    quantity: int


class CartResponseItem(BaseModel):
    product_id: str
    name: str
    price: float
    mrp: float
    image_url: str
    quantity: int
    total: float


class CartResponse(BaseModel):
    items: List[CartResponseItem]
    total_amount: float


class CartItemCreate(BaseModel):
    product_id: str
    qty: int = 1


class CartItemOut(BaseModel):
    id: int
    product_id: str
    qty: int

    model_config = {"from_attributes": True}