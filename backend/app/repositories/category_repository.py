from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.category_model import Category


def create_category(db: Session, category: Category):
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_all_categories(db: Session):
    return db.scalars(
        select(Category).where(Category.is_active == True)
    ).all()


def get_category_by_id(db: Session, category_id: int):
    return db.get(Category, category_id)
