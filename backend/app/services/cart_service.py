from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.cart_repository import *
from app.repositories.product_repository import get_product_by_id
from app.models.cart_item_model import CartItem


def get_cart_service(db: Session, user_id: int):
    cart = get_user_cart(db, user_id)
    if not cart:
        cart = create_cart(db, user_id)
    return cart


def add_to_cart_service(db: Session, user_id: int, product_id: int, quantity: int):
    product = get_product_by_id(db, product_id)
    if not product or product.stock <= 0:
        raise HTTPException(400, "Product out of stock")

    if quantity > product.stock:
        raise HTTPException(400, "Quantity exceeds stock")

    cart = get_cart_service(db, user_id)

    item = get_cart_item(db, cart.id, product_id)
    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
        )
        db.add(item)

    db.commit()
    return cart


def update_cart_service(db: Session, user_id: int, product_id: int, quantity: int):
    cart = get_cart_service(db, user_id)
    item = get_cart_item(db, cart.id, product_id)

    if not item:
        raise HTTPException(404, "Item not in cart")

    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity

    db.commit()
    return cart


def remove_from_cart_service(db: Session, user_id: int, product_id: int):
    cart = get_cart_service(db, user_id)
    item = get_cart_item(db, cart.id, product_id)

    if not item:
        raise HTTPException(404, "Item not in cart")

    db.delete(item)
    db.commit()
    return cart