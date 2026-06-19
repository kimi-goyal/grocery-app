
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    ForeignKey, Text, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False, index=True)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    subcategories = relationship(
        "Subcategory", back_populates="category",
        cascade="all, delete-orphan"
    )

    @property
    def product_count(self):
        return sum(len(sc.products) for sc in self.subcategories)


class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)

    category_id = Column(
        String,
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False
    )

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

    # 🔹 Basic
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)

    # 🔹 Pricing
    price = Column(Float, nullable=False)
    mrp = Column(Float, nullable=False)
    cost_price = Column(Float, default=0)

    # 🔹 Inventory
    stock = Column(Integer, default=0)
    unit = Column(String(30), default="kg")
    pack_size = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)

    # 🔹 Analytics (🔥 MAIN ADDITIONS)
    selling_count = Column(Integer, default=0)   # orders based
    view_count = Column(Integer, default=0)      # page visits
    cart_count = Column(Integer, default=0)      # added to cart

    # 🔹 Ratings
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)

    # 🔹 Flags (homepage logic)
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)

    # 🔹 Media
    image_url = Column(String(500))

    # 🔹 Identity
    sku = Column(String(100), unique=True, index=True)

    # 🔹 Relations
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"))
    subcategory_id = Column(String, ForeignKey("subcategories.id", ondelete="CASCADE"))

    category = relationship("Category")
    subcategory = relationship("Subcategory", back_populates="products")

    # 🔹 Status
    active = Column(Boolean, default=True)

    # 🔹 Search / SEO
    tags = Column(String)  # "organic,fresh,fruit"

    # 🔹 Time
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @property
    def discount(self):
        if self.mrp > 0:
            return round(((self.mrp - self.price) / self.mrp) * 100, 1)
        return 0.0