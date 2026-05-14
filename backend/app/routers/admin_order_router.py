from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.order import OrderOut, OrderStatusUpdate, PaginatedOrders
from app.services import order_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Orders"])


@router.get("/orders", response_model=PaginatedOrders)
def list_orders(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = order_service.get_orders(db, status, search, page, limit)
    orders_out = []
    for o in result["orders"]:
        orders_out.append({
            "id": o.id,
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "email": o.email,
            "phone": o.phone,
            "total_amount": o.total_amount,
            "status": o.status,
            "items_count": len(o.items),
            "created_at": o.created_at,
        })
    return {
        "orders": orders_out,
        "total": result["total"],
        "page": result["page"],
        "pages": result["pages"],
    }


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    o = order_service.get_order(db, order_id)
    return {**o.__dict__, "items_count": len(o.items)}


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    o = order_service.update_order_status(db, order_id, data)
    return {**o.__dict__, "items_count": len(o.items)}

