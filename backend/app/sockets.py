from typing import Dict, List
from fastapi import WebSocket
from fastapi.websockets import WebSocketDisconnect

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        key = str(user_id)
        self.active_connections.setdefault(key, []).append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        key = str(user_id)
        connections = self.active_connections.get(key)
        if not connections:
            return
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            self.active_connections.pop(key, None)

    async def send_personal_message(self, user_id: str, message: dict) -> None:
        key = str(user_id)
        connections = list(self.active_connections.get(key, []))
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
