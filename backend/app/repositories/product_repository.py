
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.product_model import Product
from sqlalchemy import select, desc



def get_product_by_id(db: Session, product_id: int):
    return db.get(Product, product_id)


def list_products(
    db: Session,
    category_id: int | None,
    sort: str | None,
):
    stmt = select(Product).where(Product.is_active == True)

    if category_id:
        stmt = stmt.where(Product.category_id == category_id)

    if sort == "price_asc":
        stmt = stmt.order_by(Product.price.asc())
    elif sort == "price_desc":
        stmt = stmt.order_by(Product.price.desc())

    return db.scalars(stmt).all()


def create_product(db: Session, product: Product):
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def search_products(db, query: str):
    stmt = (
        select(Product)
        .where(
            Product.is_active == True,
            Product.name.ilike(f"%{query}%"),
        )
    )
    return db.scalars(stmt).all()

def get_available_products(db):
    stmt = select(Product).where(
        Product.is_active == True,
        Product.stock > 0,
    )
    return db.scalars(stmt).all()



def get_trending_products(db, limit: int = 10):
    stmt = (
        select(Product)
        .where(
            Product.is_active == True,
            Product.stock > 0,
        )
        .order_by(desc(Product.total_orders))
        .limit(limit)
    )
    return db.scalars(stmt).all()


def get_recommended_products(db, limit: int = 10):
    stmt = (
        select(Product)
        .where(
            Product.is_active == True,
            Product.stock > 0,
        )
        .order_by(desc(Product.rating_avg))
        .limit(limit)
    )
    return db.scalars(stmt).all()