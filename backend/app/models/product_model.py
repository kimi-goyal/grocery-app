# from sqlalchemy import String, Float, Boolean, ForeignKey, Integer
# from sqlalchemy.orm import Mapped, mapped_column
# from app.config.database import Base

# class Product(Base):
#     __tablename__ = "products"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String, nullable=False)
#     description: Mapped[str | None]
#     price: Mapped[float] = mapped_column(Float, nullable=False)
#     image: Mapped[str | None]

#     category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"))

#     stock: Mapped[int] = mapped_column(Integer, default=0)
#     is_active: Mapped[bool] = mapped_column(Boolean, default=True)

#     total_orders: Mapped[int] = mapped_column(Integer, default=0)  # ✅ analytics
#     rating_avg: Mapped[float] = mapped_column(Float, default=0.0)


from sqlalchemy import String, Float, Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.config.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None]
    price: Mapped[float] = mapped_column(Float, nullable=False)

    image: Mapped[str | None] = mapped_column(String)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")

    stock: Mapped[int] = mapped_column(Integer, default=0)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)