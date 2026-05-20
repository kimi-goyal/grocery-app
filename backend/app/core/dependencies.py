from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import get_db
from app.dependencies.auth_dependencies import get_current_user as get_current_user_payload
from app.config.security import get_current_role
from app.models.user_model import User


def get_current_user(
    current_user: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
) -> User:
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


def require_admin(
    user: User = Depends(get_current_user),
) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return user


def require_verified(user: User = Depends(get_current_user)) -> User:
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified.")
    return user

