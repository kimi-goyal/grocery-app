from typing import Dict, List, Optional
from fastapi import WebSocket
from fastapi.websockets import WebSocketDisconnect


class ConnectionManager:
    def __init__(self) -> None:
        # user_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # admin websockets (for quick broadcast to admins)
        self.admin_connections: List[WebSocket] = []

    async def connect(self, user_id: str, websocket: WebSocket, role: Optional[str] = None) -> None:
        await websocket.accept()
        key = str(user_id)
        self.active_connections.setdefault(key, []).append(websocket)
        if role == 'admin':
            self.admin_connections.append(websocket)
            # notify users that an admin is now online
            try:
                await self.broadcast({"type": "admin_presence", "online": True})
            except Exception:
                pass
        # Debug log
        # try:
        #     print(f"[sockets] connect: user_id={user_id} role={role} active_users={len(self.active_connections)} admin_count={len(self.admin_connections)}")
        # except Exception:
        #     pass

    async def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        key = str(user_id)
        connections = self.active_connections.get(key)
        if connections and websocket in connections:
            connections.remove(websocket)
        if connections is not None and len(connections) == 0:
            self.active_connections.pop(key, None)

        was_admin = False
        if websocket in self.admin_connections:
            was_admin = True
            try:
                self.admin_connections.remove(websocket)
            except ValueError:
                pass

        # try:
        #     print(f"[sockets] disconnect: user_id={user_id} active_users={len(self.active_connections)} admin_count={len(self.admin_connections)}")
        # except Exception:
        #     pass

        # If an admin disconnected, notify all users about admin presence
        if was_admin:
            try:
                await self.broadcast({"type": "admin_presence", "online": False})
            except Exception:
                pass

    async def send_personal_message(self, user_id: str, message: dict) -> None:
        key = str(user_id)
        connections = list(self.active_connections.get(key, []))
        # try:
        #     print(f"[sockets] send_personal_message: user_id={user_id} conns={len(connections)} payload_type={message.get('type')}")
        # except Exception:
        #     pass

        for connection in connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                try:
                    print(f"[sockets] send_personal_message: websocket disconnect for user {user_id}")
                except Exception:
                    pass
                await self.disconnect(user_id, connection)
            except Exception as e:
                try:
                    print(f"[sockets] send_personal_message: error for user {user_id}: {e}")
                except Exception:
                    pass
                await self.disconnect(user_id, connection)

    async def send_to_admins(self, message: dict) -> None:
        # Send a message to all currently connected admin sockets
        conns = list(self.admin_connections)
        # try:
        #     print(f"[sockets] send_to_admins: admin_count={len(conns)} payload_type={message.get('type')}")
        # except Exception:
        #     pass
        for connection in conns:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                # No user_id here; best effort removal
                try:
                    self.admin_connections.remove(connection)
                except ValueError:
                    pass
            except Exception:
                try:
                    self.admin_connections.remove(connection)
                except ValueError:
                    pass

    async def broadcast(self, message: dict) -> None:
        user_ids = list(self.active_connections.keys())
        for user_id in user_ids:
            await self.send_personal_message(user_id, message)

    def admin_count(self) -> int:
        return len(self.admin_connections)


manager = ConnectionManager()
