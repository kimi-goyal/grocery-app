from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.order_model import Order


def create_order(db: Session, order: Order):
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_user_orders(db: Session, user_id: int):
    return db.scalars(
        select(Order).where(Order.user_id == user_id)
    ).all()


def get_order_by_id(db: Session, order_id: int):
    return db.get(Order, order_id)