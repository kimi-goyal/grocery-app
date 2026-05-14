from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from app.models.coupon import DiscountType


class CouponCreate(BaseModel):
    code: str
    description: Optional[str] = None
    discount: float
    type: DiscountType
    min_order: float = 0.0
    max_discount: float = 0.0
    usage_limit: int = 0
    expiry: datetime
    active: bool = True

    @field_validator("code")
    @classmethod
    def uppercase_code(cls, v: str) -> str:
        v = v.strip().upper()
        if not v:
            raise ValueError("Coupon code is required.")
        if len(v) > 50:
            raise ValueError("Coupon code too long.")
        return v

    @field_validator("discount")
    @classmethod
    def positive_discount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Discount must be positive.")
        return v


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount: Optional[float] = None
    type: Optional[DiscountType] = None
    min_order: Optional[float] = None
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    expiry: Optional[datetime] = None
    active: Optional[bool] = None


class CouponOut(BaseModel):
    id: str
    code: str
    description: Optional[str]
    discount: float
    type: DiscountType
    min_order: float
    max_discount: float
    usage_limit: int
    used_count: int
    expiry: datetime
    active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class CouponValidate(BaseModel):
    code: str
    order_amount: float


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: float
    message: str


