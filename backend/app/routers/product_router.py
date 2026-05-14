

# from fastapi import APIRouter, Depends, Query
# from sqlalchemy.orm import Session
# from app.dependencies.auth_dependencies import get_db
# from app.schemas.product_schema import ProductResponse
# from app.services.product_service import *

# router = APIRouter(prefix="/products", tags=["Products"])


# @router.get("/{id}", response_model=ProductResponse)
# def get_product(id: int, db: Session = Depends(get_db)):
#     return get_product_service(db, id)


# @router.get("/", response_model=list[ProductResponse])
# def list_products(
#     category: int | None = Query(None),
#     sort: str | None = Query(None),
#     db: Session = Depends(get_db),
# ):
#     return list_products_service(db, category, sort)


# @router.get("/search", response_model=list[ProductResponse])
# def search_products(
#     q: str,
#     db: Session = Depends(get_db),
# ):
#     return search_products_service(db, q)


# @router.get("/available", response_model=list[ProductResponse])
# def list_available_products(
#     db: Session = Depends(get_db),
# ):
#     return list_available_products_service(db)


# @router.get("/{product_id}/availability")
# def check_availability(
#     product_id: int,
#     db: Session = Depends(get_db),
# ):
#     return product_availability_service(db, product_id)


# @router.get("/trending", response_model=list[ProductResponse])
# def get_trending_products(
#     db: Session = Depends(get_db),
# ):
#     return trending_products_service(db)


# @router.get("/recommended", response_model=list[ProductResponse])
# def get_recommended_products(
#     db: Session = Depends(get_db),
# ):
#     return recommended_products_service(db)