from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.config.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id")
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # ✅ self-referencing relationship (for subcategories)
    parent = relationship("Category", remote_side=[id])
    products = relationship("Product", back_populates="category")