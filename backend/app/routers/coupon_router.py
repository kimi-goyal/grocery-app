from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import require_admin, get_current_user
from app.models.user_model import User
from app.schemas.coupon import (
    CouponCreate, CouponUpdate, CouponOut, UserCouponOut,
    AssignUsersRequest, CouponValidateRequest, CouponValidateResponse,
    PushSubscriptionCreate,
)
from app.services import coupon_service
from app.models.push_subscription import PushSubscription
from app.sockets import manager
import uuid

# ── Admin routes ──────────────────────────────────────────────────────────────
admin_router = APIRouter(prefix="/api/v1/admin/coupons", tags=["Admin — Coupons"])


@admin_router.get("", response_model=list[CouponOut])
def list_coupons(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return coupon_service.get_all_coupons(db)


@admin_router.post("", response_model=CouponOut, status_code=201)
async def create_coupon(data: CouponCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    try:
        import sys
        print(f"DEBUG: Received coupon data: {data}", file=sys.stderr)
        print(f"DEBUG: Expiry type: {type(data.expiry)}, value: {data.expiry}", file=sys.stderr)
        coupon = coupon_service.create_coupon(db, data)
        await manager.broadcast({
            "type": "coupon_added",
            "code": coupon.code,
            "title": "New Coupon Available",
            "body": f"Use code {coupon.code} on your next order!",
        })
        return coupon
    except Exception as e:
        import sys
        print(f"DEBUG: Error creating coupon: {e}", file=sys.stderr)
        raise


@admin_router.put("/{coupon_id}", response_model=CouponOut)
def update_coupon(coupon_id: str, data: CouponUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return coupon_service.update_coupon(db, coupon_id, data)


@admin_router.patch("/{coupon_id}/toggle", response_model=CouponOut)
def toggle_coupon(coupon_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return coupon_service.toggle_coupon(db, coupon_id)


@admin_router.delete("/{coupon_id}", status_code=204)
def delete_coupon(coupon_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    coupon_service.delete_coupon(db, coupon_id)


@admin_router.post("/{coupon_id}/assign", status_code=200)
def assign_users(coupon_id: str, data: AssignUsersRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    count = coupon_service.assign_users(db, coupon_id, data.user_ids)
    return {"assigned": count}


@admin_router.post("/{coupon_id}/notify", status_code=200)
def send_notification(coupon_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    from app.services.coupon_service import _get_or_404, _send_new_coupon_push
    c = _get_or_404(db, coupon_id)
    _send_new_coupon_push(db, c)
    return {"message": "Push notifications dispatched."}


# ── Public / user routes ──────────────────────────────────────────────────────
user_router = APIRouter(prefix="/api/v1/coupons", tags=["Coupons"])


@user_router.get("", response_model=list[UserCouponOut])
def get_my_coupons(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return coupon_service.get_user_coupons(db, user.id)


@user_router.post("/validate", response_model=CouponValidateResponse)
def validate(data: CouponValidateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return coupon_service.validate_coupon(db, data.code, data.order_amount, user.id)


# ── Push subscription ─────────────────────────────────────────────────────────
push_router = APIRouter(prefix="/api/v1/push", tags=["Push Notifications"])


@push_router.post("/subscribe", status_code=201)
def subscribe(
    data: PushSubscriptionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    existing = db.query(PushSubscription).filter(PushSubscription.endpoint == data.endpoint).first()
    if existing:
        return {"message": "Already subscribed."}
    sub = PushSubscription(
        id=str(uuid.uuid4()),
        user_id=user.id,
        endpoint=data.endpoint,
        p256dh=data.p256dh,
        auth=data.auth,
        user_agent=data.user_agent,
    )
    db.add(sub)
    db.commit()
    return {"message": "Subscribed successfully."}


@push_router.delete("/unsubscribe")
def unsubscribe(endpoint: str = Query(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.query(PushSubscription).filter(
        PushSubscription.endpoint == endpoint,
        PushSubscription.user_id == user.id,
    ).delete()
    db.commit()
    return {"message": "Unsubscribed."}


@push_router.get("/vapid-public-key")
def get_vapid_key():
    import os
    return {"key": os.getenv("VAPID_PUBLIC_KEY", "")}

