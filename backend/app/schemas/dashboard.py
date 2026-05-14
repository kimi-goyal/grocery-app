from pydantic import BaseModel
from typing import List


class DashboardStats(BaseModel):
    total_orders: int
    total_orders_delta: float
    total_revenue: float
    total_revenue_delta: float
    total_customers: int
    total_customers_delta: float
    low_stock_items: int


class SalesDataPoint(BaseModel):
    day: str
    revenue: float


class TopProduct(BaseModel):
    id: str
    name: str
    orders: int
    revenue: float
    image_url: str = ""


class InventoryAlert(BaseModel):
    id: str
    name: str
    sku: str
    stock: int
    low_stock_threshold: int
    category: str


