from pydantic import BaseModel
from typing import Optional

class GoogleLoginRequest(BaseModel):
    id_token: str


class GoogleLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict
