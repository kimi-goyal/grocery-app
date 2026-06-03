"""Sync database schema with SQLAlchemy models."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect
from app.config.database import Base
from app.models.product import Product, Category, Subcategory

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Create all tables based on models
print("🔄 Creating/updating tables based on SQLAlchemy models...")
Base.metadata.create_all(bind=engine)
print("✅ Database schema synchronized!")

# Show products table structure
inspector = inspect(engine)
columns = inspector.get_columns('products')
print("\n📋 Products table columns:")
for col in sorted(columns, key=lambda x: x['name']):
    print(f"  - {col['name']}: {col['type']}")
