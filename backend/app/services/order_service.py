# from fastapi import HTTPException
# from sqlalchemy.orm import Session

# from app.models.order_model import Order
# from app.models.order_item_model import OrderItem
# from app.repositories.order_repository import (
#     create_order,
#     get_order_by_id,
#     get_user_orders,
# )
# from app.repositories.cart_repository import get_user_cart
# from app.repositories.product_repository import get_product_by_id


# def create_order_from_cart_service(db: Session, user_id: int):
#     cart = get_user_cart(db, user_id)
#     if not cart or not cart.items:
#         raise HTTPException(400, "Cart is empty")

#     total = 0
#     order_items = []

#     for item in cart.items:
#         product = get_product_by_id(db, item.product_id)

#         if not product or product.stock < item.quantity:
#             raise HTTPException(
#                 400,
#                 f"Product {item.product_id} out of stock"
#             )

#         total += product.price * item.quantity

#         order_items.append(
#             OrderItem(
#                 product_id=product.id,
#                 quantity=item.quantity,
#                 price=product.price,
#             )
#         )

#         # 🔥 reduce stock
#         product.stock -= item.quantity

#     order = Order(
#         user_id=user_id,
#         total_amount=total,
#         items=order_items,
#     )

#     order = create_order(db, order)

#     # ✅ clear cart
#     for item in cart.items:
#         db.delete(item)

#     db.commit()
#     db.refresh(order)
#     return order


# def get_orders_service(db: Session, user_id: int):
#     return get_user_orders(db, user_id)


# def get_order_detail_service(db: Session, user_id: int, order_id: int):
#     order = get_order_by_id(db, order_id)

#     if not order or order.user_id != user_id:
#         raise HTTPException(404, "Order not found")

#     return order


# def order_tracking_service(db: Session, user_id: int, order_id: int):
#     order = get_order_detail_service(db, user_id, order_id)

#     return {
#         "order_id": order.id,
#         "status": order.status,
#     }


from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, cast, Date
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderStatusUpdate


def get_orders(
    db: Session,
    status: str = None,
    search: str = None,
    page: int = 1,
    limit: int = 50,
) -> dict:
    q = db.query(Order).options(joinedload(Order.items))

    if status and status != "All":
        try:
            q = q.filter(Order.status == OrderStatus(status))
        except ValueError:
            pass

    if search:
        q = q.filter(
            Order.customer_name.ilike(f"%{search}%") |
            Order.order_number.ilike(f"%{search}%") |
            Order.email.ilike(f"%{search}%")
        )

    q = q.order_by(Order.created_at.desc())
    total = q.count()
    orders = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


def get_order(db: Session, order_id: str) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


def update_order_status(db: Session, order_id: str, data: OrderStatusUpdate) -> Order:
    order = get_order(db, order_id)

    # Validate status transition
    forbidden = {
        OrderStatus.delivered: [OrderStatus.pending, OrderStatus.packed],
        OrderStatus.cancelled: [OrderStatus.delivered],
    }
    blocked = forbidden.get(data.status, [])
    if order.status in blocked:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{order.status.value}' to '{data.status.value}'."
        )

    order.status = data.status
    db.commit()
    db.refresh(order)
    return order


def get_sales_by_period(db: Session, period: str = "week") -> list[dict]:
    """Returns daily revenue for the last N days."""
    days = {"week": 7, "month": 30, "year": 365}.get(period, 7)
    since = datetime.now(timezone.utc) - timedelta(days=days)

    rows = (
        db.query(
            cast(Order.created_at, Date).label("day"),
            func.sum(Order.total_amount).label("revenue"),
        )
        .filter(
            Order.created_at >= since,
            Order.status != OrderStatus.cancelled,
        )
        .group_by(cast(Order.created_at, Date))
        .order_by(cast(Order.created_at, Date))
        .all()
    )

    return [
        {"day": row.day.strftime("%a"), "revenue": round(float(row.revenue), 2)}
        for row in rows
    ]
