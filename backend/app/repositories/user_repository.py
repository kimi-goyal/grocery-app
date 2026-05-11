from sqlalchemy import select

from sqlalchemy.orm import Session
from app.models.user_model import User


def get_user_by_email(db: Session, email: str) -> User | None:
    normalized_email = email.strip().lower()
    return db.scalar(select(User).where(User.email == normalized_email))


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.scalar(select(User).where(User.id == user_id))


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_user(db: Session, user: User) -> None:
    user.is_verified = True
    db.commit()


def get_user_by_username(db: Session, username: str):
    return db.scalar(select(User).where(User.username == username))


def get_user_by_identifier(db: Session, identifier: str):
    identifier = identifier.strip()
    if "@" in identifier:
        return get_user_by_email(db, identifier.lower())
    return get_user_by_username(db, identifier)