from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.category_model import Category
from app.repositories.category_repository import *





def create_category_service(db: Session, data):
    category = Category(**data.dict())
    return create_category(db, category)


def list_categories_service(db: Session):
    return get_all_categories(db)


def get_category_service(db: Session, category_id: int):
    category = get_category_by_id(db, category_id)
    if not category or not category.is_active:
        raise HTTPException(404, "Category not found")
    return category


def update_category_service(db: Session, category_id: int, data):
    category = get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


def delete_category_service(db: Session, category_id: int):
    category = get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # ✅ soft delete (recommended)
    category.is_active = False
    db.commit()