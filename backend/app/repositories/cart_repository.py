from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.cart_model import Cart
from app.models.cart_item_model import CartItem


def get_user_cart(db: Session, user_id: int):
    return db.scalar(select(Cart).where(Cart.user_id == user_id))


def create_cart(db: Session, user_id: int):
    cart = Cart(user_id=user_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart


def get_cart_item(db: Session, cart_id: int, product_id: int):
    return db.scalar(
        select(CartItem).where(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id,
        )
    )