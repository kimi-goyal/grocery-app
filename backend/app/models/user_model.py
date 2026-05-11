# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     Boolean,
#     DateTime
# )
# from datetime import datetime

# from app.config.database import Base


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)

#     name = Column(String(100), nullable=False)
#     email = Column(String(255), unique=True, index=True, nullable=False)

#     password_hash = Column(String, nullable=False)

#     role = Column(String(50), default="customer")
#     is_verified = Column(Boolean, default=False)
#     is_active = Column(Boolean, default=True)

#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(
#         DateTime,
#         default=datetime.utcnow,
#         onupdate=datetime.utcnow
#     )
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.config.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(default="user")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
