from typing import Dict, List
from fastapi import WebSocket
from fastapi.websockets import WebSocketDisconnect

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        connections = self.active_connections.get(user_id)
        if not connections:
            return
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            self.active_connections.pop(user_id, None)

    async def send_personal_message(self, user_id: str, message: dict) -> None:
        connections = list(self.active_connections.get(user_id, []))
        for connection in connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(user_id, connection)
            except Exception:
                self.disconnect(user_id, connection)

    async def broadcast(self, message: dict) -> None:
        user_ids = list(self.active_connections.keys())
        for user_id in user_ids:
            await self.send_personal_message(user_id, message)

manager = ConnectionManager()
