from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, cast, Date
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderStatusUpdate,RatingSubmit
 
 
 
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
 
 
# ── User: fetch own orders ────────────────────────────────────────────────────
 
def get_user_orders(
    db: Session,
    user_id: str,
    status: str = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    q = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == user_id)
    )
    if status and status != "All":
        try:
            q = q.filter(Order.status == OrderStatus(status))
        except ValueError:
            pass
 
    q = q.order_by(Order.created_at.desc())
    total = q.count()
    orders = q.offset((page - 1) * limit).limit(limit).all()
 
    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "order_number": o.order_number,
            "total_amount": o.total_amount,
            "status": o.status,
            "items_count": len(o.items),
            "payment_method": o.payment_method,
            "is_rated": o.is_rated,
            "overall_rating": o.overall_rating,
            "created_at": o.created_at,
            "items_preview": o.items[:2], # thumbnail row
        })
 
    return {
        "orders": result,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }
 
 
def get_user_order_detail(db: Session, order_id: str, user_id: str) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order
 
 
# ── Rating ────────────────────────────────────────────────────────────────────
 
# def submit_rating(
#     db: Session,
#     order_id: str,
#     user_id: str,
#     data: RatingSubmit,
# ) -> Order:
#     order = get_user_order_detail(db, order_id, user_id)
 
#     if order.status != OrderStatus.delivered:
#         raise HTTPException(400, "You can only rate delivered orders.")
#     if order.is_rated:
#         raise HTTPException(400, "You have already rated this order.")
 
#     order.is_rated = True
#     order.overall_rating = data.overall_rating
#     order.delivery_rating = data.delivery_rating
#     order.quality_rating = data.quality_rating
#     order.packaging_rating = data.packaging_rating
#     order.review_text = data.review_text
#     order.rated_at = datetime.now(timezone.utc)
 
#     # Per-item ratings
#     if data.item_ratings:
#         for item in order.items:
#             if item.id in data.item_ratings:
#                 item.item_rating = data.item_ratings[item.id]
#     db.commit()
#     db.refresh(order)
#     return order
 
def submit_rating(db: Session, order_id: str, user_id: str, data: RatingSubmit) -> Order:
    order = get_user_order_detail(db, order_id, user_id)

    if order.status != OrderStatus.delivered:
        raise HTTPException(400, "You can only rate delivered orders.")
    if order.is_rated:
        raise HTTPException(400, "You have already rated this order.")

    # ✅ Order ratings
    order.is_rated = True
    order.overall_rating = data.overall_rating
    order.delivery_rating = data.delivery_rating
    order.quality_rating = data.quality_rating
    order.packaging_rating = data.packaging_rating
    order.review_text = data.review_text
    order.rated_at = datetime.now(timezone.utc)

    # ✅ CORRECT IMPORT
    from app.models.product import Product

    if data.item_ratings:
        for item in order.items:
            rating = data.item_ratings.get(item.id)
            if rating is None:
                continue

            item.item_rating = rating

            if not item.product_id:
                continue

            product = db.query(Product).filter(Product.id == item.product_id).first()

            if product:
                current_rating = product.rating or 0
                current_count = product.reviews_count or 0

                total_rating = current_rating * current_count
                total_rating += rating

                product.reviews_count = current_count + 1
                product.rating = round(total_rating / product.reviews_count, 2)

    db.commit()
    db.refresh(order)
    return order

# ── Admin: orders ─────────────────────────────────────────────────────────────
 
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
    return {"orders": orders, "total": total, "page": page, "pages": (total + limit - 1) // limit}
 
 
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
    forbidden = {
        OrderStatus.delivered: [OrderStatus.pending, OrderStatus.packed],
        OrderStatus.cancelled: [OrderStatus.delivered],
    }
    blocked = forbidden.get(data.status, [])
    if order.status in blocked:
        raise HTTPException(
            400,
            f"Cannot change from '{order.status.value}' to '{data.status.value}'."
        )
    order.status = data.status
    db.commit()
    db.refresh(order)
    return order
 
 
def get_sales_by_period(db: Session, period: str = "week") -> list[dict]:
    from datetime import timedelta
    days = {"week": 7, "month": 30, "year": 365}.get(period, 7)
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = (
        db.query(
            cast(Order.created_at, Date).label("day"),
            func.sum(Order.total_amount).label("revenue"),
        )
        .filter(Order.created_at >= since, Order.status != OrderStatus.cancelled)
        .group_by(cast(Order.created_at, Date))
        .order_by(cast(Order.created_at, Date))
        .all()
    )
    return [{"day": r.day.strftime("%a"), "revenue": round(float(r.revenue), 2)} for r in rows]
 