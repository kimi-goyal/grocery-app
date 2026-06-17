
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio

from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.sockets import manager
from fastapi import HTTPException, status

router = APIRouter(prefix="/api/v1/support", tags=["Support"])


class TicketCreate(BaseModel):
    order_id: str
    type: str # missing_item | wrong_item | other
    message: Optional[str] = None


@router.post("/ticket", status_code=201)
def create_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Creates a support ticket and triggers refund logic.
    For now logs to console — wire to your refund/notification system later.
    """
    ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"

    # Future: insert into support_tickets table
    # Future: trigger Razorpay refund API
    # Future: send email/WhatsApp notification to user
    # Future: notify admin via push or Slack

    print(f"[Support] Ticket {ticket_id} | User {user.id} | Order {data.order_id} | Type {data.type}")

    return {
        "ticket_id": ticket_id,
        "status": "created",
        "message": "Your complaint has been registered. Refund will be processed within 24 hours.",
    }


class ChatMessage(BaseModel):
    text: str
    ticket_id: Optional[str] = None
    type: Optional[str] = None  # e.g. 'connect' | 'message'


@router.post("/message")
async def send_support_message(
    data: ChatMessage,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Send a lightweight support chat message to all connected admin dashboards.
    This will be forwarded to admins over websockets (best-effort, async).
    """
    payload = {
        "type": "support_chat",
        "from_user_id": str(user.id),
        "from_name": getattr(user, "name", None) or getattr(user, "email", "user"),
        "text": data.text,
        "ticket_id": data.ticket_id,
        "time": datetime.utcnow().isoformat(),
    }

    # Fire-and-forget sending to admin websockets (schedule on running loop)
    try:
        asyncio.create_task(manager.send_to_admins(payload))
    except RuntimeError:
        # if no running loop, await directly (best-effort)
        try:
            await manager.send_to_admins(payload)
        except Exception:
            pass

    admin_ct = manager.admin_count()
    print(f"[support] message from user {user.id} forwarded to admins. admin_count={admin_ct}")

    return {"sent": True, "admin_online": admin_ct > 0, "admin_count": admin_ct}



@router.get('/admins')
def get_admin_stats():
    """Debug: return number of connected admins."""
    return {"admin_count": manager.admin_count()}


class AdminSendPayload(BaseModel):
    user_id: str
    text: str


@router.post('/admin/send')
async def admin_send_to_user(
    data: AdminSendPayload,
    current_user: User = Depends(get_current_user),
):
    # Only admins can send
    if getattr(current_user, 'role', 'user') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin only')

    payload = {
        'type': 'support_chat',
        'from_admin_id': str(current_user.id),
        'from_admin_name': getattr(current_user, 'name', None) or getattr(current_user, 'email', 'admin'),
        'text': data.text,
        'time': datetime.utcnow().isoformat(),
    }

    # best-effort
    try:
        asyncio.create_task(manager.send_personal_message(data.user_id, payload))
    except RuntimeError:
        try:
            await manager.send_personal_message(data.user_id, payload)
        except Exception:
            pass

    return {"sent": True}
