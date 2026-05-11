# from pydantic import BaseModel
# from typing import Optional

# class ProductCreate(BaseModel):
#     name: str
#     description: Optional[str] = None
#     price: float
#     category_id: Optional[int] = None
#     stock: int = 0

# class ProductUpdate(BaseModel):
#     name: Optional[str]
#     description: Optional[str]
#     price: Optional[float]
#     stock: Optional[int]
#     is_active: Optional[bool]

# class ProductResponse(BaseModel):
#     id: int
#     name: str
#     description: Optional[str]
#     price: float
#     image: Optional[str]
#     stock: int
#     rating_avg: float

#     class Config:
#         from_attributes = True


from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    stock: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    category_id: Optional[int]
    stock: Optional[int]
    is_active: Optional[bool]


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image: Optional[str]
    stock: int
    category_id: int

    class Config:
        from_attributes = True