from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.product_model import Product
from app.repositories.product_repository import *

from app.repositories.product_repository import (
    get_trending_products,
    get_recommended_products,
)



def get_product_service(db: Session, product_id: int):
    product =get_product_by_id(db, product_id) 
    if not product or not product.is_active:
        raise HTTPException(404, "Product not found")
    return product

def list_products_service(db, category, sort):
    return list_products(db, category, sort)

def create_product_service(db, data, image):
    product = Product(**data.dict(), image=image)
    return create_product(db, product)

def update_product_service(db, product_id, data, image=None):
    update_data = data.dict(exclude_unset=True)
    if image:
        update_data['image'] = image
    
    product = get_product_by_id(db, product_id)
    if not product:
        return None
    
    for key, value in update_data.items():
        if value is not None:
            setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product


def delete_product_service(db, product_id):
    product = get_product_by_id(db, product_id)
    if not product:
        return False
    
    db.delete(product)
    db.commit()
    return True



def search_products_service(db, query: str):
    return search_products(db, query)


def list_available_products_service(db):
    return get_available_products(db)


def product_availability_service(db, product_id: int):
    product = get_product_by_id(db, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "product_id": product.id,
        "in_stock": product.stock > 0,
        "available_quantity": product.stock,
    }




def trending_products_service(db):
    return get_trending_products(db)


def recommended_products_service(db):
    return get_recommended_products(db)

# from fastapi import HTTPException
# from sqlalchemy.orm import Session
# from app.models.product_model import Product
# from app.repositories.product_repository import *


# def get_product_service(db: Session, product_id: int):
#     product = get_product_by_id(db, product_id)
#     if not product or not product.is_active:
#         raise HTTPException(404, "Product not found")
#     return product


# def list_products_service(db: Session, category_id, sort):
#     return list_products(db, category_id, sort)


# def create_product_service(db: Session, data, image_path: str | None):
#     product = Product(**data.dict(), image=image_path)
#     return create_product(db, product)


# def update_product_service(
#     db: Session,
#     product_id: int,
#     data,
#     image_path: str | None,
# ):
#     product = get_product_by_id(db, product_id)
#     if not product:
#         raise HTTPException(404, "Product not found")

#     for key, value in data.dict(exclude_unset=True).items():
#         setattr(product, key, value)

#     if image_path:
#         product.image = image_path

#     db.commit()
#     db.refresh(product)
#     return product