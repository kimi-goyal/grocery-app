from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.repositories.order_repository import (
    create_order,
    get_order_by_id,
    get_user_orders,
)
from app.repositories.cart_repository import get_user_cart
from app.repositories.product_repository import get_product_by_id


def create_order_from_cart_service(db: Session, user_id: int):
    cart = get_user_cart(db, user_id)
    if not cart or not cart.items:
        raise HTTPException(400, "Cart is empty")

    total = 0
    order_items = []

    for item in cart.items:
        product = get_product_by_id(db, item.product_id)

        if not product or product.stock < item.quantity:
            raise HTTPException(
                400,
                f"Product {item.product_id} out of stock"
            )

        total += product.price * item.quantity

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
        )

        # 🔥 reduce stock
        product.stock -= item.quantity

    order = Order(
        user_id=user_id,
        total_amount=total,
        items=order_items,
    )

    order = create_order(db, order)

    # ✅ clear cart
    for item in cart.items:
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


def get_orders_service(db: Session, user_id: int):
    return get_user_orders(db, user_id)


def get_order_detail_service(db: Session, user_id: int, order_id: int):
    order = get_order_by_id(db, order_id)

    if not order or order.user_id != user_id:
        raise HTTPException(404, "Order not found")

    return order


def order_tracking_service(db: Session, user_id: int, order_id: int):
    order = get_order_detail_service(db, user_id, order_id)

    return {
        "order_id": order.id,
        "status": order.status,
    }