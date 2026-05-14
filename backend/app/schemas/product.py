
# from pydantic import BaseModel
# from typing import Optional


# class ProductCreate(BaseModel):
#     name: str
#     description: Optional[str] = None
#     price: float
#     category_id: int
#     stock: int = 0


# class ProductUpdate(BaseModel):
#     name: Optional[str]
#     description: Optional[str]
#     price: Optional[float]
#     category_id: Optional[int]
#     stock: Optional[int]
#     is_active: Optional[bool]


# class ProductResponse(BaseModel):
#     id: int
#     name: str
#     description: Optional[str]
#     price: float
#     image: Optional[str]
#     stock: int
#     category_id: int

#     class Config:
#         from_attributes = True




from pydantic import BaseModel, field_validator 
from typing import Optional, List
from datetime import datetime


# ── Category ──────────────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    image_url: Optional[str] = None

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Category name is required.")
        return v


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryOut(BaseModel):
    id: str
    name: str
    image_url: Optional[str]
    is_active: bool
    product_count: int
    created_at: datetime
    
    subcategories: List[SubcategoryOut] = []

    model_config = {"from_attributes": True}


# ── Subcategory ───────────────────────────────────────────────────────────────

class SubcategoryCreate(BaseModel):
    name: str
    category_id: str

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Subcategory name is required.")
        return v


class SubcategoryUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class SubcategoryOut(BaseModel):
    id: str
    name: str
    category_id: str
    is_active: bool
    products: List["ProductOut"] = [] 
    model_config = {"from_attributes": True}


# ── Product ───────────────────────────────────────────────────────────────────

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    mrp: float
    stock: int
    unit: str = "kg"
    sku: Optional[str] = None
    image_url: Optional[str] = None
    category_id: str
    subcategory_id: str
    active: bool = True
    low_stock_threshold: int = 10

    @field_validator("price", "mrp")
    @classmethod
    def positive(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Price must be non-negative.")
        return round(v, 2)

    @field_validator("stock")
    @classmethod
    def non_negative_stock(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock cannot be negative.")
        return v


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    mrp: Optional[float] = None
    stock: Optional[int] = None
    unit: Optional[str] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None
    low_stock_threshold: Optional[int] = None


class ProductOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    mrp: float
    discount: float
    stock: int
    unit: str
    sku: Optional[str]
    image_url: Optional[str]
    category_id: str
    subcategory_id: str
    active: bool
    low_stock_threshold: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class StockUpdate(BaseModel):
    stock: int

    @field_validator("stock")
    @classmethod
    def non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock cannot be negative.")
        return v
