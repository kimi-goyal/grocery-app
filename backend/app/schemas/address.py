from pydantic import BaseModel
from typing import Optional


class AddressCreate(BaseModel):
    tag: str = "Home"
    name: str
    line1: str
    line2: Optional[str] = None
    phone: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class AddressOut(BaseModel):
    id: int
    tag: str
    name: str
    line1: str
    line2: Optional[str]
    phone: str
    lat: Optional[float]
    lng: Optional[float]
    is_default: bool

    model_config = {"from_attributes": True}
