
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

from app.models.support import SupportTicket, SupportMessage


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
    message_id = uuid.uuid4().hex

    payload = {
        "type": "support_chat",
        "message_id": message_id,
        "from_user_id": str(user.id),
        "from_name": getattr(user, "name", None) or getattr(user, "email", "user"),
        "text": data.text,
        "ticket_id": data.ticket_id,
        "time": datetime.utcnow().isoformat(),
    }

    # Determine ticket: prefer provided ticket_id; otherwise reuse an existing open ticket for this user; if none, create a new ticket.
    ticket_id = data.ticket_id
    if not ticket_id:
        # If this is an explicit 'connect' from the user, start a new ticket (fresh conversation)
        if data.type == 'connect':
            ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        else:
            # try to reuse an open ticket for this user
            existing = db.query(SupportTicket).filter(SupportTicket.user_id == user.id, SupportTicket.status == 'open').first()
            if existing:
                ticket_id = existing.ticket_id
            elif data.type == 'message' or data.text:
                ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
    if ticket_id:
        payload['ticket_id'] = ticket_id

        t = ticket_id
        ticket = db.query(SupportTicket).filter(SupportTicket.ticket_id == t).first()
        if not ticket:
            ticket = SupportTicket(ticket_id=t, user_id=user.id, from_name=payload.get('from_name'))
            db.add(ticket)
            db.commit()
            db.refresh(ticket)

        msg = SupportMessage(
            message_id=message_id,
            ticket_id=t,
            from_role='user',
            from_user_id=user.id,
            from_name=payload.get('from_name'),
            text=data.text,
        )
        db.add(msg)
        db.commit()

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

    return {"sent": True, "admin_online": admin_ct > 0, "admin_count": admin_ct, "ticket_id": payload.get('ticket_id')}



@router.get('/admins')
def get_admin_stats():
    """Debug: return number of connected admins."""
    return {"admin_count": manager.admin_count()}


class AdminSendPayload(BaseModel):
    user_id: str
    ticket_id: Optional[str] = None
    text: str


@router.post('/admin/send')
async def admin_send_to_user(
    data: AdminSendPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only admins can send
    if getattr(current_user, 'role', 'user') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin only')

    message_id = uuid.uuid4().hex
    payload = {
        'type': 'support_chat',
        'message_id': message_id,
        'from_admin_id': str(current_user.id),
        'from_admin_name': getattr(current_user, 'name', None) or getattr(current_user, 'email', 'admin'),
        'text': data.text,
        'ticket_id': data.ticket_id,
        'time': datetime.utcnow().isoformat(),
    }

    # persist to DB if ticket_id provided
    # persist to DB: prefer provided ticket_id; otherwise attach to an open ticket for the target user or create one
    t = data.ticket_id
    if not t and data.user_id:
        existing = db.query(SupportTicket).filter(SupportTicket.user_id == int(data.user_id), SupportTicket.status == 'open').first()
        if existing:
            t = existing.ticket_id
    if t:
        ticket = db.query(SupportTicket).filter(SupportTicket.ticket_id == t).first()
        if not ticket:
            ticket = SupportTicket(ticket_id=t, user_id=int(data.user_id) if data.user_id else None, from_name=None)
            db.add(ticket)
            db.commit()
            db.refresh(ticket)

        msg = SupportMessage(
            message_id=message_id,
            ticket_id=t,
            from_role='admin',
            from_user_id=current_user.id,
            from_name=payload.get('from_admin_name'),
            text=data.text,
        )
        db.add(msg)
        db.commit()

    # best-effort: deliver to user
    try:
        asyncio.create_task(manager.send_personal_message(data.user_id, payload))
    except RuntimeError:
        try:
            await manager.send_personal_message(data.user_id, payload)
        except Exception:
            pass

    return {"sent": True}


@router.get('/conversations')
def get_conversations(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(SupportTicket)
    if status:
        q = q.filter(SupportTicket.status == status)
    rows = q.order_by(SupportTicket.updated_at.desc()).all()
    out = []
    for r in rows:
        out.append({
            'ticket_id': r.ticket_id,
            'user_id': r.user_id,
            'from_name': r.from_name,
            'status': r.status,
            'last_time': r.updated_at.isoformat() if r.updated_at else None,
        })
    return {'conversations': out}


@router.get('/mine')
def get_my_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).order_by(SupportTicket.updated_at.desc()).all()
    out = []
    for r in rows:
        out.append({
            'ticket_id': r.ticket_id,
            'user_id': r.user_id,
            'from_name': r.from_name,
            'status': r.status,
            'last_time': r.updated_at.isoformat() if r.updated_at else None,
        })
    return {'conversations': out}


@router.get('/conversations/{ticket_id}')
def get_conversation(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    msgs = db.query(SupportMessage).filter(SupportMessage.ticket_id == ticket_id).order_by(SupportMessage.created_at.asc()).all()
    out = []
    for m in msgs:
        out.append({
            'message_id': m.message_id,
            'from_role': m.from_role,
            'from_user_id': m.from_user_id,
            'from_name': m.from_name,
            'text': m.text,
            'time': m.created_at.isoformat() if m.created_at else None,
        })
    return {'ticket_id': ticket.ticket_id, 'user_id': ticket.user_id, 'messages': out, 'status': ticket.status}


@router.post('/conversations/{ticket_id}/resolve')
def resolve_conversation(ticket_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(SupportTicket).filter(SupportTicket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Ticket not found')
    ticket.status = 'resolved'
    db.add(ticket)
    db.commit()
    return {'ticket_id': ticket.ticket_id, 'status': 'resolved'}


# NOTE: conversations are persisted to DB; in-memory store removed.
