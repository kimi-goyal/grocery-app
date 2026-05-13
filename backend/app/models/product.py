import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    ForeignKey, Text, DateTime, func
)
from sqlalchemy.orm import relationship
from app.config.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    subcategories = relationship(
        "Subcategory", back_populates="category",
        cascade="all, delete-orphan"
    )

    @property
    def product_count(self) -> int:
        return sum(len(sc.products) for sc in self.subcategories)


class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="subcategories")
    products = relationship(
        "Product", back_populates="subcategory",
        cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    mrp = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    unit = Column(String(30), default="kg")
    sku = Column(String(100), unique=True, nullable=True, index=True)
    image_url = Column(String(500), nullable=True)
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    subcategory_id = Column(String, ForeignKey("subcategories.id", ondelete="CASCADE"), nullable=False)
    active = Column(Boolean, default=True)
    low_stock_threshold = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    subcategory = relationship("Subcategory", back_populates="products")
    category = relationship("Category")

    @property
    def discount(self) -> float:
        if self.mrp > 0:
            return round(((self.mrp - self.price) / self.mrp) * 100, 1)
        return 0.0
