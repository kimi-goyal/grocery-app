
import uuid
from datetime import timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate, CouponUpdate


def get_all_coupons(db: Session) -> list[Coupon]:
    return db.query(Coupon).order_by(Coupon.created_at.desc()).all()


def get_coupon(db: Session, coupon_id: str) -> Coupon:
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Coupon not found.")
    return c


def create_coupon(db: Session, data: CouponCreate) -> Coupon:
    if db.query(Coupon).filter(Coupon.code == data.code).first():
        raise HTTPException(status_code=400, detail="Coupon code already exists.")
    c = Coupon(id=str(uuid.uuid4()), **data.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def update_coupon(db: Session, coupon_id: str, data: CouponUpdate) -> Coupon:
    c = get_coupon(db, coupon_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(c, field, value)
    db.commit()
    db.refresh(c)
    return c


def toggle_coupon(db: Session, coupon_id: str) -> Coupon:
    c = get_coupon(db, coupon_id)
    c.active = not c.active
    db.commit()
    db.refresh(c)
    return c


def delete_coupon(db: Session, coupon_id: str) -> None:
    c = get_coupon(db, coupon_id)
    db.delete(c)
    db.commit()


def validate_coupon(db: Session, code: str, order_amount: float) -> dict:
    from datetime import datetime
    c = db.query(Coupon).filter(Coupon.code == code.upper()).first()
    if not c:
        return {"valid": False, "discount_amount": 0, "message": "Coupon not found."}
    if not c.active:
        return {"valid": False, "discount_amount": 0, "message": "Coupon is inactive."}
    if c.expiry.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return {"valid": False, "discount_amount": 0, "message": "Coupon has expired."}
    if c.usage_limit > 0 and c.used_count >= c.usage_limit:
        return {"valid": False, "discount_amount": 0, "message": "Coupon usage limit reached."}
    if order_amount < c.min_order:
        return {
            "valid": False,
            "discount_amount": 0,
            "message": f"Minimum order ₹{c.min_order:.0f} required.",
        }

    if c.type.value == "percentage":
        disc = (order_amount * c.discount) / 100
        if c.max_discount > 0:
            disc = min(disc, c.max_discount)
    else:
        disc = c.discount

    return {
        "valid": True,
        "discount_amount": round(disc, 2),
        "message": f"Coupon applied! You save ₹{disc:.2f}.",
    }

