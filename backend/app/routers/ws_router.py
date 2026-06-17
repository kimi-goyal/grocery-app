from fastapi import APIRouter, Query, status, WebSocket
from fastapi.websockets import WebSocketDisconnect
from app.config.security import decode_access_token
from app.sockets import manager

router = APIRouter()

@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: str | None = Query(None)):
    if token is None:
        token = websocket.cookies.get("access_token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        payload = decode_access_token(token)
        if payload.get("type") != "access":
            raise ValueError("Invalid token type")
        user_id = payload["user_id"]
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    role = payload.get("role")
    print(f"[ws_router] websocket connect user_id={user_id} role={role}")
    await manager.connect(user_id, websocket, role=role)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(user_id, websocket)
    except Exception:
        await manager.disconnect(user_id, websocket)
