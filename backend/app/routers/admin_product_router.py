 
# from fastapi import APIRouter, Depends, Query, UploadFile, File
# from sqlalchemy.orm import Session
# from typing import Optional
# from app.dependencies.auth_dependencies import get_db
# from app.core.dependencies import require_admin
# from app.models.user_model import User
# from app.schemas.product import (
#    CategoryCreate, CategoryUpdate, CategoryOut,
#    SubcategoryCreate, SubcategoryUpdate, SubcategoryOut,
#    ProductCreate, ProductUpdate, ProductOut, StockUpdate,
# )
# from app.services import product_service
 
# router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Products"])
 
 
# # ── Image upload ──────────────────────────────────────────────────────────────
 
# @router.post("/upload-image")
# async def upload_image(
#    file: UploadFile = File(...),
#    _: User = Depends(require_admin),
# ):
#    url = await product_service.save_product_image(file)
#    return {"url": url}
 
 
# # ── Categories ────────────────────────────────────────────────────────────────
 
# @router.get("/categories", response_model=list[CategoryOut])
# def list_categories(db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    return product_service.get_all_categories(db)
 
 
# @router.post("/categories", response_model=CategoryOut, status_code=201)
# def create_category(
#    data: CategoryCreate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.create_category(db, data)
 
 
# @router.get("/categories/{cat_id}", response_model=CategoryOut)
# def get_category(cat_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    return product_service.get_category(db, cat_id)
 
 
# @router.put("/categories/{cat_id}", response_model=CategoryOut)
# def update_category(
#    cat_id: str,
#    data: CategoryUpdate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.update_category(db, cat_id, data)
 
 
# @router.delete("/categories/{cat_id}", status_code=204)
# def delete_category(cat_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    product_service.delete_category(db, cat_id)
 
 
# # ── Subcategories ─────────────────────────────────────────────────────────────
 
# @router.post("/subcategories", response_model=SubcategoryOut, status_code=201)
# def create_subcategory(
#    data: SubcategoryCreate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.create_subcategory(db, data)
 
 
# @router.put("/subcategories/{sub_id}", response_model=SubcategoryOut)
# def update_subcategory(
#    sub_id: str,
#    data: SubcategoryUpdate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.update_subcategory(db, sub_id, data)
 
 
# @router.delete("/subcategories/{sub_id}", status_code=204)
# def delete_subcategory(sub_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    product_service.delete_subcategory(db, sub_id)
 
 
# # ── Products ──────────────────────────────────────────────────────────────────
 
# @router.get("/products")
# def list_products(
#    category_id: Optional[str] = Query(None),
#    subcategory_id: Optional[str] = Query(None),
#    search: Optional[str] = Query(None),
#    active_only: bool = Query(False),
#    page: int = Query(1, ge=1),
#    limit: int = Query(50, ge=1, le=200),
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.get_products(db, category_id, subcategory_id, search, active_only, page, limit)
 
 
# @router.post("/products", response_model=ProductOut, status_code=201)
# def create_product(
#    data: ProductCreate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.create_product(db, data)
 
 
# @router.get("/products/{product_id}", response_model=ProductOut)
# def get_product(product_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    return product_service.get_product(db, product_id)
 
 
# @router.put("/products/{product_id}", response_model=ProductOut)
# def update_product(
#    product_id: str,
#    data: ProductUpdate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.update_product(db, product_id, data)
 
 
# @router.delete("/products/{product_id}", status_code=204)
# def delete_product(product_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
#    product_service.delete_product(db, product_id)
 
 
# @router.patch("/inventory/{product_id}", response_model=ProductOut)
# def update_stock(
#    product_id: str,
#    data: StockUpdate,
#    db: Session = Depends(get_db),
#    _: User = Depends(require_admin),
# ):
#    return product_service.update_stock(db, product_id, data.stock)
 
from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies.auth_dependencies import get_db
from app.schemas.product import (
    CategoryCreate, CategoryUpdate, CategoryOut,
    SubcategoryCreate, SubcategoryUpdate, SubcategoryOut,
    ProductCreate, ProductUpdate, ProductOut, StockUpdate,
)
from app.services import product_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Products (TEST MODE)"])


# ── Image upload ──────────────────────────────────────────────────────────────

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...)
):
    url = await product_service.save_product_image(file)
    return {"url": url}


# ── Categories ────────────────────────────────────────────────────────────────

@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return product_service.get_all_categories(db)


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
):
    return product_service.create_category(db, data)


@router.get("/categories/{cat_id}", response_model=CategoryOut)
def get_category(cat_id: str, db: Session = Depends(get_db)):
    return product_service.get_category(db, cat_id)


@router.put("/categories/{cat_id}", response_model=CategoryOut)
def update_category(
    cat_id: str,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
):
    return product_service.update_category(db, cat_id, data)


@router.delete("/categories/{cat_id}", status_code=204)
def delete_category(cat_id: str, db: Session = Depends(get_db)):
    product_service.delete_category(db, cat_id)


# ── Subcategories ─────────────────────────────────────────────────────────────

@router.post("/subcategories", response_model=SubcategoryOut, status_code=201)
def create_subcategory(
    data: SubcategoryCreate,
    db: Session = Depends(get_db),
):
    return product_service.create_subcategory(db, data)


@router.put("/subcategories/{sub_id}", response_model=SubcategoryOut)
def update_subcategory(
    sub_id: str,
    data: SubcategoryUpdate,
    db: Session = Depends(get_db),
):
    return product_service.update_subcategory(db, sub_id, data)


@router.delete("/subcategories/{sub_id}", status_code=204)
def delete_subcategory(sub_id: str, db: Session = Depends(get_db)):
    product_service.delete_subcategory(db, sub_id)


# ── Products ──────────────────────────────────────────────────────────────────

@router.get("/products")
def list_products(
    category_id: Optional[str] = Query(None),
    subcategory_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    active_only: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return product_service.get_products(
        db, category_id, subcategory_id, search, active_only, page, limit
    )


@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
):
    return product_service.create_product(db, data)


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    return product_service.get_product(db, product_id)


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    data: ProductUpdate,
    db: Session = Depends(get_db),
):
    return product_service.update_product(db, product_id, data)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product_service.delete_product(db, product_id)


@router.patch("/inventory/{product_id}", response_model=ProductOut)
def update_stock(
    product_id: str,
    data: StockUpdate,
    db: Session = Depends(get_db),
):
    return product_service.update_stock(db, product_id, data.stock)
