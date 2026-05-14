from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.dashboard import DashboardStats, TopProduct, InventoryAlert, SalesDataPoint
from app.services import dashboard_service, order_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Dashboard"])


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return dashboard_service.get_dashboard_stats(db)


@router.get("/dashboard/sales", response_model=list[SalesDataPoint])
def get_sales(
    period: str = Query("week", pattern="^(week|month|year)$"),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return order_service.get_sales_by_period(db, period)


@router.get("/dashboard/top-products", response_model=list[TopProduct])
def get_top_products(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return dashboard_service.get_top_products(db, limit)


@router.get("/dashboard/inventory-alerts", response_model=list[InventoryAlert])
def get_inventory_alerts(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return dashboard_service.get_inventory_alerts(db)


@router.get("/inventory", response_model=list[InventoryAlert])
def get_inventory(
    search: str = Query(None),
    low_stock: bool = Query(False),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    from app.models.product import Product
    q = db.query(Product)
    if search:
        q = q.filter(
            Product.name.ilike(f"%{search}%") | Product.sku.ilike(f"%{search}%")
        )
    if low_stock:
        q = q.filter(Product.stock <= Product.low_stock_threshold)
    products = q.order_by(Product.stock.asc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "sku": p.sku or "",
            "stock": p.stock,
            "low_stock_threshold": p.low_stock_threshold,
            "category": p.category.name if p.category else "",
        }
        for p in products
    ]
