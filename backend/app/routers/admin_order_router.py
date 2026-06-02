from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.order import OrderOut, OrderStatusUpdate, PaginatedOrders
from app.services import order_service
from app.models.order import Order, OrderItem, OrderStatus
from app.sockets import manager
from sqlalchemy import func

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin — Orders"])

@router.get("")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()

    result = []
    for o in orders:
        result.append({
            "id": o.order_number,
            "customer": o.customer_name,
            "phone": o.phone,
            "items": len(o.items),
            "amount": o.total_amount,
            "status": o.status.value,
            "date": o.created_at.strftime("%d %b %Y"),
        })

    return result

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0

    customers = db.query(func.count(Order.user_id.distinct())).scalar()

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()

    return {
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "customers": customers,
        "recentOrders": [
            {
                "id": o.order_number,
                "customer": o.customer_name,
                "amount": o.total_amount,
                "status": o.status.value,
                "date": o.created_at.strftime("%d %b"),
            } for o in recent_orders
        ]
    }

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.order_number == order_id).first()

    if not order:
        raise HTTPException(404, "Order not found")

    order.status = data.status
    db.commit()
    db.refresh(order)

    message = {
        "type": "order_status",
        "orderNumber": order.order_number,
        "status": order.status.value,
        "title": f"Order {order.order_number} status updated",
        "body": f"Your order is now {order.status.value}.",
        "userId": str(order.user_id) if order.user_id is not None else None,
    }

    if order.user_id is not None:
        await manager.send_personal_message(order.user_id, message)

    return {"msg": "Updated"}