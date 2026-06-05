
import json
import os
from typing import Optional
from sqlalchemy.orm import Session
from app.models.push_subscription import PushSubscription
from app.models.user_model import User
from app.config.settings import settings

try:
    from pywebpush import webpush, WebPushException
    PUSH_AVAILABLE = True
except ImportError:
    PUSH_AVAILABLE = False


def send_push(endpoint: str, p256dh: str, auth: str, payload: dict) -> bool:
    """Send a single Web Push notification. Returns True on success."""
    if not PUSH_AVAILABLE:
        print(f"[Push] pywebpush not installed. Would send: {payload}")
        return False

    vapid_private = os.getenv("VAPID_PRIVATE_KEY", "")
    vapid_email = os.getenv("VAPID_EMAIL", "mailto:vidishakharbanda20@gmail.com")

    if not vapid_private:
        print(f"[Push] VAPID_PRIVATE_KEY not set. Payload: {payload}")
        return False

    try:
        webpush(
            subscription_info={"endpoint": endpoint, "keys": {"p256dh": p256dh, "auth": auth}},
            data=json.dumps(payload),
            vapid_private_key=vapid_private,
            vapid_claims={"sub": vapid_email},
        )
        return True
    except WebPushException as e:
        print(f"[Push] Failed: {e}")
        return False


def send_push_to_user(db: Session, user_id: int, payload: dict) -> int:
    """Send push to all devices of a user. Returns number of successful sends."""
    subs = db.query(PushSubscription).filter(PushSubscription.user_id == user_id).all()
    sent = 0
    dead_endpoints = []

    for sub in subs:
        ok = send_push(sub.endpoint, sub.p256dh, sub.auth, payload)
        if ok:
            sent += 1
        else:
            # 410 Gone means subscription is dead — clean up
            dead_endpoints.append(sub.id)

    for sid in dead_endpoints:
        db.query(PushSubscription).filter(PushSubscription.id == sid).delete()
    if dead_endpoints:
        db.commit()

    return sent


def broadcast_push(db: Session, payload: dict, user_ids: Optional[list[int]] = None) -> int:
    """Send push to all users (or a subset). Returns total sent."""
    q = db.query(PushSubscription)
    if user_ids:
        q = q.filter(PushSubscription.user_id.in_(user_ids))
    subs = q.all()
    sent = 0
    for sub in subs:
        ok = send_push(sub.endpoint, sub.p256dh, sub.auth, payload)
        if ok:
            sent += 1
    return sent

