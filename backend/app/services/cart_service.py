from sqlalchemy.orm import Session
from app.models.cart import CartItem  


def get_cart(db: Session, user_id: int):
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()

    result = []

    for item in items:
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "qty": item.qty,
            "name": item.product.name,
            "price": item.product.price,
            "image": item.product.image_url,
            "unit": item.product.unit,
        })

    return result

def add_to_cart(db: Session, user_id: int, product_id: str, qty: int):
    item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()

    if item:
        item.qty += qty
    else:
        item = CartItem(
            user_id=user_id,
            product_id=product_id,
            qty=qty
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


def update_cart(db: Session, user_id: int, product_id: str, qty: int):
    item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()

    if not item:
        return None

    if qty <= 0:
        db.delete(item)
    else:
        item.qty = qty

    db.commit()
    return item


def remove_from_cart(db: Session, user_id: int, product_id: str):
    item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()

    if item:
        db.delete(item)
        db.commit()

    return {"ok": True}