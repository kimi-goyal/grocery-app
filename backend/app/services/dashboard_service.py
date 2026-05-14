from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from app.models.order import Order, OrderStatus
from app.models.user_model import User
from app.models.product import Product
from app.models.order import OrderItem


def _delta(current: float, previous: float) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


def get_dashboard_stats(db: Session) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday_start = today_start - timedelta(days=1)

    def order_count(since, until):
        return db.query(func.count(Order.id)).filter(
            Order.created_at >= since, Order.created_at < until,
            Order.status != OrderStatus.cancelled
        ).scalar() or 0

    def revenue(since, until):
        return db.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= since, Order.created_at < until,
            Order.status != OrderStatus.cancelled
        ).scalar() or 0.0

    def customer_count(since, until):
        return db.query(func.count(User.id)).filter(
            User.created_at >= since, User.created_at < until,
            User.role == "user"
        ).scalar() or 0

    total_orders = db.query(func.count(Order.id)).filter(Order.status != OrderStatus.cancelled).scalar() or 0
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.status != OrderStatus.cancelled).scalar() or 0.0
    total_customers = db.query(func.count(User.id)).filter(User.role == "user").scalar() or 0
    low_stock_items = db.query(func.count(Product.id)).filter(
        Product.stock <= Product.low_stock_threshold
    ).scalar() or 0

    today_orders = order_count(today_start, now)
    yesterday_orders = order_count(yesterday_start, today_start)
    today_rev = revenue(today_start, now)
    yesterday_rev = revenue(yesterday_start, today_start)
    today_cust = customer_count(today_start, now)
    yesterday_cust = customer_count(yesterday_start, today_start)

    return {
        "total_orders": total_orders,
        "total_orders_delta": _delta(today_orders, yesterday_orders),
        "total_revenue": round(float(total_revenue), 2),
        "total_revenue_delta": _delta(today_rev, yesterday_rev),
        "total_customers": total_customers,
        "total_customers_delta": _delta(today_cust, yesterday_cust),
        "low_stock_items": low_stock_items,
    }


def get_top_products(db: Session, limit: int = 5) -> list[dict]:
    rows = (
        db.query(
            OrderItem.product_id,
            OrderItem.name,
            func.sum(OrderItem.quantity).label("total_qty"),
            func.sum(OrderItem.price * OrderItem.quantity).label("total_rev"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status != OrderStatus.cancelled)
        .group_by(OrderItem.product_id, OrderItem.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )

    result = []
    for row in rows:
        product = db.query(Product).filter(Product.id == row.product_id).first()
        result.append({
            "id": row.product_id or "",
            "name": row.name,
            "orders": int(row.total_qty),
            "revenue": round(float(row.total_rev), 2),
            "image_url": product.image_url if product else "",
        })
    return result


def get_inventory_alerts(db: Session) -> list[dict]:
    products = (
        db.query(Product)
        .filter(Product.stock <= Product.low_stock_threshold)
        .order_by(Product.stock.asc())
        .all()
    )
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
