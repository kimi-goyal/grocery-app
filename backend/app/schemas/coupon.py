from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.coupon import DiscountType, CouponTargetType


class CouponCreate(BaseModel):
    code: str
    title: str
    description: Optional[str] = None
    discount: float
    type: DiscountType
    min_order: float = 0.0
    max_discount: float = 0.0
    usage_limit: int = 0
    expiry: datetime
    active: bool = True
    target_type: CouponTargetType = CouponTargetType.all
    push_notify: bool = False
    notify_before_expiry_hours: int = 24
    image_url: Optional[str] = None
    assigned_user_ids: List[int] = [] # only used if target_type = specific

    @field_validator("code")
    @classmethod
    def upper_code(cls, v: str) -> str:
        v = v.strip().upper()
        if not v:
            raise ValueError("Code required.")
        return v

    @field_validator("discount")
    @classmethod
    def positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Discount must be positive.")
        return v


class CouponUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    discount: Optional[float] = None
    type: Optional[DiscountType] = None
    min_order: Optional[float] = None
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    expiry: Optional[datetime] = None
    active: Optional[bool] = None
    target_type: Optional[CouponTargetType] = None
    push_notify: Optional[bool] = None
    notify_before_expiry_hours: Optional[int] = None
    image_url: Optional[str] = None


class AssignUsersRequest(BaseModel):
    user_ids: List[int]


class CouponOut(BaseModel):
    id: str
    code: str
    title: str
    description: Optional[str]
    discount: float
    type: DiscountType
    min_order: float
    max_discount: float
    usage_limit: int
    used_count: int
    expiry: datetime
    active: bool
    target_type: CouponTargetType
    push_notify: bool
    notify_before_expiry_hours: int
    image_url: Optional[str]
    created_at: datetime
    assigned_count: int = 0

    model_config = {"from_attributes": True}


class UserCouponOut(BaseModel):
    """What the user sees — hides admin-only fields."""
    id: str
    code: str
    title: str
    description: Optional[str]
    discount: float
    type: DiscountType
    min_order: float
    max_discount: float
    expiry: datetime
    image_url: Optional[str]
    is_used: bool = False
    hours_left: Optional[float] = None # None if > 48h remaining

    model_config = {"from_attributes": True}


class CouponValidateRequest(BaseModel):
    code: str
    order_amount: float


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: float
    message: str
    coupon: Optional[UserCouponOut] = None


class PushSubscriptionCreate(BaseModel):
    endpoint: str
    p256dh: str
    auth: str
    user_agent: Optional[str] = None
