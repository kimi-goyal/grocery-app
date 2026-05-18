from pydantic import BaseModel
from typing import Optional
from datetime import datetime
 
 
class CustomerOut(BaseModel):
    id: int
    name: str
    email: str
    username: str
    role: str
    phone: Optional[str] = None
    is_active: bool
    is_verified: bool
    provider: str
    profile_image: Optional[str]
    order_count: int = 0
    total_spent: float = 0.0
    joined_date: str
    status: str
 
    model_config = {"from_attributes": True}
 
 
class PaginatedCustomers(BaseModel):
    customers: list[CustomerOut]
    total: int
    page: int
    pages: int
 
 