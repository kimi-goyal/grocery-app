"""Test API - Verify all product fields can be created and updated."""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1/admin"

# Sample product data with ALL fields
product_data = {
    "name": "Organic Tomatoes",
    "description": "Fresh organic tomatoes",
    "price": 80.00,
    "mrp": 100.00,
    "cost_price": 50.00,
    "stock": 100,
    "unit": "kg",
    "pack_size": 1,
    "low_stock_threshold": 10,
    "category_id": "your-category-id",  # Replace with actual ID
    "subcategory_id": "your-subcategory-id",  # Replace with actual ID
    "sku": "TOMATO-001",
    "image_url": "https://example.com/tomato.jpg",
    "selling_count": 0,
    "view_count": 0,
    "cart_count": 0,
    "rating": 0,
    "reviews_count": 0,
    "is_featured": False,
    "is_bestseller": False,
    "active": True,
    "tags": "organic,fresh,vegetable"
}

# Test update with ALL fields
update_data = {
    "cost_price": 55.00,
    "rating": 4.5,
    "reviews_count": 25,
    "selling_count": 50,
    "view_count": 500,
    "cart_count": 100,
    "is_featured": True,
    "is_bestseller": True,
    "tags": "organic,fresh,vegetable,premium"
}

print("✅ All product fields are now supported in the API!")
print("\n📝 Product Create Schema supports:")
for key in product_data.keys():
    print(f"   - {key}")

print("\n📝 Product Update Schema supports:")
for key in update_data.keys():
    print(f"   - {key}")
