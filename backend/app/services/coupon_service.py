import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from app.models.coupon import (
    Coupon, CouponAssignment, CouponUsage,
    CouponNotification, CouponTargetType, DiscountType
)
from app.models.user_model import User
from app.schemas.coupon import CouponCreate, CouponUpdate
from app.services.push_service import broadcast_push, send_push_to_user


# ── Admin: create ─────────────────────────────────────────────────────────────

def create_coupon(db: Session, data: CouponCreate) -> Coupon:
    if db.query(Coupon).filter(Coupon.code == data.code).first():
        raise HTTPException(400, "Coupon code already exists.")

    assigned_ids = data.assigned_user_ids or []
    coupon_data = data.model_dump(exclude={"assigned_user_ids"})
    coupon = Coupon(id=str(uuid.uuid4()), **coupon_data)
    db.add(coupon)
    db.flush()

    # Create per-user assignments for targeted coupons
    if data.target_type == CouponTargetType.specific and assigned_ids:
        for uid in assigned_ids:
            db.add(CouponAssignment(
                id=str(uuid.uuid4()),
                coupon_id=coupon.id,
                user_id=uid,
            ))

    db.commit()
    db.refresh(coupon)

    # Send "new coupon" push notification
    if data.push_notify:
        _send_new_coupon_push(db, coupon, assigned_ids if data.target_type == CouponTargetType.specific else None)

    return coupon


def update_coupon(db: Session, coupon_id: str, data: CouponUpdate) -> Coupon:
    c = _get_or_404(db, coupon_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(c, field, value)
    db.commit()
    db.refresh(c)
    return c


def toggle_coupon(db: Session, coupon_id: str) -> Coupon:
    c = _get_or_404(db, coupon_id)
    c.active = not c.active
    db.commit()
    db.refresh(c)
    return c


def delete_coupon(db: Session, coupon_id: str) -> None:
    c = _get_or_404(db, coupon_id)
    db.delete(c)
    db.commit()


def assign_users(db: Session, coupon_id: str, user_ids: list[int]) -> int:
    """Bulk assign users to a coupon (for target_type=specific)."""
    c = _get_or_404(db, coupon_id)
    existing = {
        a.user_id for a in
        db.query(CouponAssignment).filter(CouponAssignment.coupon_id == coupon_id).all()
    }
    new_ids = [uid for uid in user_ids if uid not in existing]
    for uid in new_ids:
        db.add(CouponAssignment(id=str(uuid.uuid4()), coupon_id=coupon_id, user_id=uid))
    db.commit()

    # Push notify newly assigned users
    if new_ids:
        _send_new_coupon_push(db, c, new_ids)

    return len(new_ids)


def get_all_coupons(db: Session) -> list[Coupon]:
    cleanup_expired_coupons(db)
    coupons = db.query(Coupon).order_by(Coupon.created_at.desc()).all()
    for c in coupons:
        c.assigned_count = db.query(func.count(CouponAssignment.id)).filter(
            CouponAssignment.coupon_id == c.id
        ).scalar() or 0
    return coupons


# ── User: list visible coupons ────────────────────────────────────────────────

def get_user_coupons(db: Session, user_id: int) -> list[dict]:
    """Returns all coupons visible and valid for this user."""
    cleanup_expired_coupons(db)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found.")

    now = datetime.now(timezone.utc)

    # All active, non-expired coupons
    all_coupons = db.query(Coupon).filter(
        Coupon.active == True,
        Coupon.expiry > now,
    ).all()

    # User order count (for new_user check)
    from app.models.order import Order
    order_count = db.query(func.count(Order.id)).filter(Order.user_id == user_id).scalar() or 0

    # Already used coupon IDs
    used_ids = {
        u.coupon_id for u in
        db.query(CouponUsage).filter(CouponUsage.user_id == user_id).all()
    }

    # Coupons assigned specifically to this user
    assigned_ids = {
        a.coupon_id for a in
        db.query(CouponAssignment).filter(CouponAssignment.user_id == user_id).all()
    }

    result = []
    for c in all_coupons:
        # Check eligibility
        if c.target_type == CouponTargetType.new_user and order_count > 0:
            continue
        if c.target_type == CouponTargetType.specific and c.id not in assigned_ids:
            continue
        if c.usage_limit > 0 and c.used_count >= c.usage_limit:
            continue

        # Hours remaining for expiry badge
        delta = c.expiry - now
        hours_left = delta.total_seconds() / 3600
        result.append({
            "id": c.id,
            "code": c.code,
            "title": c.title,
            "description": c.description,
            "discount": c.discount,
            "type": c.type,
            "min_order": c.min_order,
            "max_discount": c.max_discount,
            "expiry": c.expiry,
            "image_url": c.image_url,
            "is_used": c.id in used_ids,
            "hours_left": round(hours_left, 1) if hours_left <= 48 else None,
        })

    return result


# ── Validation (used at checkout) ─────────────────────────────────────────────

def validate_coupon(
    db: Session,
    code: str,
    order_amount: float,
    user_id: Optional[int] = None,
) -> dict:
    c = db.query(Coupon).filter(Coupon.code == code.upper().strip()).first()
    if not c:
        return {"valid": False, "discount_amount": 0.0, "message": "Coupon not found.", "coupon": None}

    now = datetime.now(timezone.utc)

    if not c.active:
        return {"valid": False, "discount_amount": 0.0, "message": "This coupon is no longer active.", "coupon": None}

    expiry = c.expiry if c.expiry.tzinfo else c.expiry.replace(tzinfo=timezone.utc)
    if expiry < now:
        return {"valid": False, "discount_amount": 0.0, "message": "This coupon has expired.", "coupon": None}

    if c.usage_limit > 0 and c.used_count >= c.usage_limit:
        return {"valid": False, "discount_amount": 0.0, "message": "Coupon usage limit reached.", "coupon": None}

    if user_id:
        already_used = db.query(CouponUsage).filter(
            CouponUsage.coupon_id == c.id,
            CouponUsage.user_id == user_id,
        ).first()
        if already_used:
            return {"valid": False, "discount_amount": 0.0, "message": "You've already used this coupon.", "coupon": None}

        # Eligibility check
        if c.target_type == CouponTargetType.specific:
            assigned = db.query(CouponAssignment).filter(
                CouponAssignment.coupon_id == c.id,
                CouponAssignment.user_id == user_id,
            ).first()
            if not assigned:
                return {"valid": False, "discount_amount": 0.0, "message": "This coupon is not available for your account.", "coupon": None}

        if c.target_type == CouponTargetType.new_user:
            from app.models.order import Order
            order_count = db.query(func.count(Order.id)).filter(Order.user_id == user_id).scalar() or 0
            if order_count > 0:
                return {"valid": False, "discount_amount": 0.0, "message": "This coupon is only for new users.", "coupon": None}

    if order_amount < c.min_order:
        return {
            "valid": False,
            "discount_amount": 0.0,
            "message": f"Minimum order ₹{c.min_order:.0f} required to use this coupon.",
            "coupon": None,
        }

    # Calculate discount
    if c.type == DiscountType.percentage:
        disc = (order_amount * c.discount) / 100
        if c.max_discount > 0:
            disc = min(disc, c.max_discount)
    else:
        disc = min(c.discount, order_amount)

    delta = expiry - now
    hrs_left = round(delta.total_seconds() / 3600, 1)

    coupon_out = {
        "id": c.id, "code": c.code, "title": c.title,
        "description": c.description, "discount": c.discount,
        "type": c.type, "min_order": c.min_order,
        "max_discount": c.max_discount, "expiry": c.expiry,
        "image_url": c.image_url, "is_used": False,
        "hours_left": hrs_left if hrs_left <= 48 else None,
    }

    return {
        "valid": True,
        "discount_amount": round(disc, 2),
        "message": f"🎉 Coupon applied! You save ₹{disc:.2f}.",
        "coupon": coupon_out,
    }


def record_usage(db: Session, coupon_id: str, user_id: int, order_id: str) -> None:
    """Call this after a successful order is placed."""
    db.add(CouponUsage(
        id=str(uuid.uuid4()),
        coupon_id=coupon_id,
        user_id=user_id,
        order_id=order_id,
    ))
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if c:
        c.used_count = (c.used_count or 0) + 1
    db.commit()


def ensure_default_new_user_coupon(db: Session) -> Coupon:
    """Create the default FIRST20 new-user coupon if it does not already exist."""
    code = 'FIRST20'
    existing = db.query(Coupon).filter(func.upper(Coupon.code) == code).first()
    if existing:
        # Ensure the default first-order coupon metadata stays consistent
        updated = False
        if existing.title != 'Flat 20% OFF on your first order':
            existing.title = 'Flat 20% OFF on your first order'
            updated = True
        if existing.description != 'Use this code on your first order for a one-time 20% discount.':
            existing.description = 'Use this code on your first order for a one-time 20% discount.'
            updated = True
        if existing.discount != 20.0:
            existing.discount = 20.0
            updated = True
        if existing.type != DiscountType.percentage:
            existing.type = DiscountType.percentage
            updated = True
        if existing.min_order != 0.0:
            existing.min_order = 0.0
            updated = True
        if existing.target_type != CouponTargetType.new_user:
            existing.target_type = CouponTargetType.new_user
            updated = True
        if updated:
            db.commit()
            db.refresh(existing)
        return existing

    expiry = datetime.now(timezone.utc) + timedelta(days=365)
    default_coupon = CouponCreate(
        code=code,
        title='Flat 20% OFF on your first order',
        description='Use this code on your first order for a one-time 20% discount.',
        discount=20.0,
        type=DiscountType.percentage,
        min_order=0.0,
        max_discount=0.0,
        usage_limit=0,
        expiry=expiry,
        active=True,
        target_type=CouponTargetType.new_user,
        push_notify=False,
        notify_before_expiry_hours=24,
        image_url=None,
    )
    return create_coupon(db, default_coupon)


def cleanup_expired_coupons(db: Session) -> int:
    """Deletes coupons whose expiry timestamp is now in the past."""
    now = datetime.now(timezone.utc)
    expired_coupons = db.query(Coupon).filter(Coupon.expiry <= now).all()
    count = len(expired_coupons)
    if count:
        for coupon in expired_coupons:
            db.delete(coupon)
        db.commit()
    return count


# ── Expiry warning scheduler ──────────────────────────────────────────────────

def send_expiry_warnings(db: Session) -> int:
    """
    Run this via a cron job / APScheduler every hour.
    Sends push to eligible users whose coupons expire within notify_before_expiry_hours.
    """
    now = datetime.now(timezone.utc)
    sent = 0

    coupons = db.query(Coupon).filter(
        Coupon.active == True,
        Coupon.expiry > now,
    ).all()

    for c in coupons:
        expiry = c.expiry if c.expiry.tzinfo else c.expiry.replace(tzinfo=timezone.utc)
        hours_remaining = (expiry - now).total_seconds() / 3600

        if hours_remaining > c.notify_before_expiry_hours:
            continue

        # Find eligible users who haven't been warned yet
        already_notified = {
            n.user_id for n in
            db.query(CouponNotification).filter(
                CouponNotification.coupon_id == c.id,
                CouponNotification.type == "expiry_warning",
            ).all()
        }

        if c.target_type == CouponTargetType.specific:
            user_ids = [
                a.user_id for a in
                db.query(CouponAssignment).filter(CouponAssignment.coupon_id == c.id).all()
                if a.user_id not in already_notified
            ]
        else:
            user_ids = [
                u.id for u in
                db.query(User).filter(User.is_verified == True, User.is_active == True).all()
                if u.id not in already_notified
            ]

        payload = {
            "type": "expiry_warning",
            "title": f"⏰ Coupon Expiring Soon!",
            "body": f"{c.code} expires in {int(hours_remaining)}h — use it now!",
            "code": c.code,
            "hours": int(hours_remaining),
            "coupon_id": c.id,
            "url": "/checkout",
        }

        for uid in user_ids:
            ok = send_push_to_user(db, uid, payload)
            if ok > 0:
                db.add(CouponNotification(
                    id=str(uuid.uuid4()),
                    coupon_id=c.id,
                    user_id=uid,
                    type="expiry_warning",
                ))
                sent += 1

    db.commit()
    return sent


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_or_404(db: Session, coupon_id: str) -> Coupon:
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not c:
        raise HTTPException(404, "Coupon not found.")
    return c


def _send_new_coupon_push(db: Session, coupon: Coupon, user_ids: Optional[list[int]] = None) -> None:
    payload = {
        "type": "new_coupon",
        "title": "🎁 New Coupon Available!",
        "body": f"Use {coupon.code} — {coupon.title}",
        "code": coupon.code,
        "coupon_id": coupon.id,
        "url": "/coupons",
    }
    broadcast_push(db, payload, user_ids)

    # Record notifications sent
    targets = user_ids or [
        u.id for u in db.query(User).filter(User.is_verified == True, User.is_active == True).all()
    ]
    for uid in targets:
        db.add(CouponNotification(
            id=str(uuid.uuid4()),
            coupon_id=coupon.id,
            user_id=uid,
            type="new_coupon",
        ))
    db.commit()

