import os 
import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, UploadFile
from app.models.product import Category, Subcategory, Product
from app.schemas.product import (
    CategoryCreate, CategoryUpdate,
    SubcategoryCreate, SubcategoryUpdate,
    ProductCreate, ProductUpdate
)
from app.config.settings import settings


# ── Categories ────────────────────────────────────────────────────────────────

def get_all_categories(db: Session) -> list[Category]:
    cats = (
        db.query(Category)
        .options(joinedload(Category.subcategories).joinedload(Subcategory.products))
        .order_by(Category.name)
        .all()
    )

    # Return plain serializable structures so frontend always receives
    # `rating` and `reviews_count` fields for products.
    out = []
    for c in cats:
        subcats = []
        for s in c.subcategories:
            prods = []
            for p in s.products:
                prods.append({
                    "id": p.id,
                    "name": p.name,
                    "description": p.description,
                    "price": p.price,
                    "mrp": p.mrp,
                    "discount": getattr(p, 'discount', 0),
                    "stock": p.stock,
                    "unit": p.unit,
                    "sku": p.sku,
                    "image_url": p.image_url,
                    "category_id": p.category_id,
                    "subcategory_id": p.subcategory_id,
                    "active": p.active,
                    "pack_size": p.pack_size,
                    "low_stock_threshold": p.low_stock_threshold,
                    "created_at": p.created_at,
                    "updated_at": p.updated_at,
                    "selling_count": getattr(p, 'selling_count', 0),
                    "view_count": getattr(p, 'view_count', 0),
                    "cart_count": getattr(p, 'cart_count', 0),
                    "rating": float(getattr(p, 'rating', 0) or 0),
                    "reviews_count": int(getattr(p, 'reviews_count', 0) or 0),
                    "is_featured": bool(getattr(p, 'is_featured', False)),
                    "is_bestseller": bool(getattr(p, 'is_bestseller', False)),
                })
            subcats.append({
                "id": s.id,
                "name": s.name,
                "category_id": s.category_id,
                "is_active": s.is_active,
                "products": prods,
            })

        out.append({
            "id": c.id,
            "name": c.name,
            "image_url": c.image_url,
            "is_active": c.is_active,
            "product_count": sum(len(sc.products) for sc in c.subcategories),
            "created_at": c.created_at,
            "subcategories": subcats,
        })

    return out


def get_category(db: Session, cat_id: str) -> Category:
    cat = (
        db.query(Category)
        .options(joinedload(Category.subcategories).joinedload(Subcategory.products))
        .filter(Category.id == cat_id)
        .first()
    )
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    return cat


def create_category(db: Session, data: CategoryCreate) -> Category:
    if db.query(Category).filter(func.lower(Category.name) == data.name.lower()).first():
        raise HTTPException(status_code=400, detail="Category name already exists.")
    cat = Category(id=str(uuid.uuid4()), name=data.name.strip(), image_url=data.image_url)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_category(db: Session, cat_id: str, data: CategoryUpdate) -> Category:
    cat = get_category(db, cat_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


def delete_category(db: Session, cat_id: str) -> None:
    cat = get_category(db, cat_id)
    db.delete(cat)
    db.commit()


# ── Subcategories ─────────────────────────────────────────────────────────────

def create_subcategory(db: Session, data: SubcategoryCreate) -> Subcategory:
    get_category(db, data.category_id)
    sub = Subcategory(id=str(uuid.uuid4()), name=data.name.strip(), category_id=data.category_id)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


def update_subcategory(db: Session, sub_id: str, data: SubcategoryUpdate) -> Subcategory:
    sub = db.query(Subcategory).filter(Subcategory.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(sub, field, value)
    db.commit()
    db.refresh(sub)
    return sub


def delete_subcategory(db: Session, sub_id: str) -> None:
    sub = db.query(Subcategory).filter(Subcategory.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found.")
    db.delete(sub)
    db.commit()


# ── Products ──────────────────────────────────────────────────────────────────

def get_products(
    db: Session,
    category_id: str = None,
    subcategory_id: str = None,
    search: str = None,
    active_only: bool = False,
    page: int = 1,
    limit: int = 50,
) -> dict:
    q = db.query(Product)
    if category_id:
        q = q.filter(Product.category_id == category_id)
    if subcategory_id:
        q = q.filter(Product.subcategory_id == subcategory_id)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    if active_only:
        q = q.filter(Product.active == True)
    total = q.count()
    products = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "products": products,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


def get_product(db: Session, product_id: str) -> Product:
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found.")
    return p


def _generate_sku(name: str, db: Session) -> str:
    base = name[:3].upper().replace(" ", "")
    candidate = f"{base}-{str(uuid.uuid4())[:6].upper()}"
    while db.query(Product).filter(Product.sku == candidate).first():
        candidate = f"{base}-{str(uuid.uuid4())[:6].upper()}"
    return candidate


def create_product(db: Session, data: ProductCreate) -> Product:
    get_category(db, data.category_id)
    sub = db.query(Subcategory).filter(Subcategory.id == data.subcategory_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found.")

    sku = data.sku or _generate_sku(data.name, db)
    p = Product(id=str(uuid.uuid4()), sku=sku, **data.model_dump(exclude={"sku"}))
    p.sku = sku
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def update_product(db: Session, product_id: str, data: ProductUpdate) -> Product:
    p = get_product(db, product_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return p


def delete_product(db: Session, product_id: str) -> None:
    p = get_product(db, product_id)
    db.delete(p)
    db.commit()


def update_stock(db: Session, product_id: str, stock: int) -> Product:
    p = get_product(db, product_id)
    if stock < 0:
        raise HTTPException(status_code=400, detail="Stock cannot be negative.")
    p.stock = stock
    db.commit()
    db.refresh(p)
    return p


async def save_product_image(file: UploadFile) -> str:
    """Save uploaded image file, return relative URL path."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "img")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    return f"http://localhost:8000/uploads/{filename}"

