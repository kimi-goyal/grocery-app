
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class DriverCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    vehicle_number: Optional[str] = None
    vehicle_type: Optional[str] = None

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Driver name is required.")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Phone number is required.")
        return v


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    vehicle_number: Optional[str] = None
    vehicle_type: Optional[str] = None
    is_available: Optional[bool] = None
    is_active: Optional[bool] = None


class DriverOut(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str]
    vehicle_number: Optional[str]
    vehicle_type: Optional[str]
    is_available: bool
    is_active: bool
    total_deliveries: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class DriverListItem(BaseModel):
    """Lighter model for list view"""
    id: str
    name: str
    phone: str
    vehicle_number: Optional[str]
    vehicle_type: Optional[str]
    is_available: bool
    is_active: bool
    total_deliveries: int

    model_config = {"from_attributes": True}
