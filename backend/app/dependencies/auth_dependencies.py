from fastapi import HTTPException, Request, status
from app.config.security import decode_access_token

# Dependency to get current user from access token stored in cookies or Authorization header
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        authorization = request.headers.get("Authorization")
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ", 1)[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_access_token(token)
    token_type = payload.get("type")
    if token_type is not None and token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )
   
    return payload

