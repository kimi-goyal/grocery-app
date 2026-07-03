
from fastapi import APIRouter, Depends, Query 
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.product import Product
from app.models.order import Order, OrderItem
from sqlalchemy import func
from typing import Optional
import uuid

router = APIRouter(prefix="/api/v1/products", tags=["Products — Public"])


def _fmt(p: Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "mrp": p.mrp,
        "discount": p.discount,
        "stock": p.stock,
        "unit": p.unit,
        "pack_size": p.pack_size or 1,
        "image_url": p.image_url,
        "rating": float(p.rating or 0),
        "reviews_count": int(p.reviews_count or 0),
        "is_featured": p.is_featured,
        "is_bestseller": p.is_bestseller,
        "selling_count": p.selling_count or 0,
        "cart_count": p.cart_count or 0,
        "view_count": p.view_count or 0,
        "category_id": p.category_id,
        "subcategory_id":p.subcategory_id,
        "tags": p.tags or "",
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "active": p.active,
    }


# ── Track view ────────────────────────────────────────────────────────────────
@router.post("/{product_id}/view")
def track_view(product_id: str, db: Session = Depends(get_db)):
    """Called when user opens/sees a product. Increments view_count."""
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.view_count = (p.view_count or 0) + 1
        db.commit()
    return {"ok": True}


# ── Track cart add ────────────────────────────────────────────────────────────
@router.post("/{product_id}/cart-add")
def track_cart_add(product_id: str, db: Session = Depends(get_db)):
    """Called when user adds product to cart. Increments cart_count."""
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.cart_count = (p.cart_count or 0) + 1
        db.commit()
    return {"ok": True}


# ── Similar products ──────────────────────────────────────────────────────────
@router.get("/{product_id}/similar")
def get_similar(
    product_id: str,
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """
    Returns similar products using this priority:
    1. Same subcategory (most similar)
    2. Same category (fallback)
    3. Same tags overlap (further fallback)
    Excludes the product itself.
    """
    source = db.query(Product).filter(Product.id == product_id).first()
    if not source:
        return []

    # Priority 1: same subcategory
    same_sub = (
        db.query(Product)
        .filter(
            Product.subcategory_id == source.subcategory_id,
            Product.id != product_id,
            Product.active == True,
            Product.stock > 0,
        )
        .order_by(Product.selling_count.desc())
        .limit(limit)
        .all()
    )

    results = list(same_sub)

    # Priority 2: same category, fill remaining slots
    if len(results) < limit:
        exclude_ids = [p.id for p in results] + [product_id]
        same_cat = (
            db.query(Product)
            .filter(
                Product.category_id == source.category_id,
                Product.id.notin_(exclude_ids),
                Product.active == True,
                Product.stock > 0,
            )
            .order_by(Product.selling_count.desc())
            .limit(limit - len(results))
            .all()
        )
        results.extend(same_cat)

    # Priority 3: tag overlap, fill remaining
    if len(results) < limit and source.tags:
        source_tags = [t.strip() for t in source.tags.split(",") if t.strip()]
        if source_tags:
            exclude_ids = [p.id for p in results] + [product_id]
            tag_products = (
                db.query(Product)
                .filter(
                    Product.id.notin_(exclude_ids),
                    Product.active == True,
                    Product.stock > 0,
                )
                .all()
            )
            tag_matches = []
            for p in tag_products:
                if p.tags:
                    p_tags = [t.strip() for t in p.tags.split(",")]
                    overlap = len(set(source_tags) & set(p_tags))
                    if overlap > 0:
                        tag_matches.append((overlap, p))
            tag_matches.sort(key=lambda x: x[0], reverse=True)
            results.extend([p for _, p in tag_matches[:limit - len(results)]])

    return [_fmt(p) for p in results[:limit]]


# ── Frequently bought together ────────────────────────────────────────────────
@router.get("/{product_id}/frequently-bought")
def get_frequently_bought(
    product_id: str,
    limit: int = Query(4, ge=1, le=8),
    db: Session = Depends(get_db),
):
    """
    Finds products that appear in the same orders as this product.
    Falls back to popular products in same category.
    """
    # Find order IDs that contain this product
    order_ids_with_product = (
        db.query(OrderItem.order_id)
        .filter(OrderItem.product_id == product_id)
        .subquery()
    )

    # Find other products in those same orders
    co_purchased = (
        db.query(OrderItem.product_id, func.count(OrderItem.id).label("co_count"))
        .filter(
            OrderItem.order_id.in_(order_ids_with_product),
            OrderItem.product_id != product_id,
        )
        .group_by(OrderItem.product_id)
        .order_by(func.count(OrderItem.id).desc())
        .limit(limit)
        .all()
    )

    if co_purchased:
        product_ids = [row.product_id for row in co_purchased]
        products = db.query(Product).filter(
            Product.id.in_(product_ids),
            Product.active == True,
            Product.stock > 0,
        ).all()
        # Sort by co_purchased order
        id_order = {pid: i for i, pid in enumerate(product_ids)}
        products.sort(key=lambda p: id_order.get(p.id, 999))
        return [_fmt(p) for p in products]

    # Fallback: top-selling products in same category
    source = db.query(Product).filter(Product.id == product_id).first()
    if not source:
        return []

    fallback = (
        db.query(Product)
        .filter(
            Product.category_id == source.category_id,
            Product.id != product_id,
            Product.active == True,
            Product.stock > 0,
        )
        .order_by(Product.selling_count.desc())
        .limit(limit)
        .all()
    )
    return [_fmt(p) for p in fallback]


# ── Recommended for you ───────────────────────────────────────────────────────
@router.get("/recommended")
def get_recommended(
    user_id: Optional[str] = Query(None),
    limit: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db),
):
    """
    If user_id provided: recommend based on their order history categories.
    Otherwise: return top selling + featured products.
    """
    if user_id:
        # Find categories user ordered from most
        from app.models.order import Order
        user_orders = db.query(Order).filter(Order.user_id == user_id).all()
        ordered_product_ids = []
        for o in user_orders:
            for item in o.items:
                if item.product_id:
                    ordered_product_ids.append(item.product_id)

        if ordered_product_ids:
            # Get categories of ordered products
            ordered_products = db.query(Product).filter(
                Product.id.in_(ordered_product_ids)
            ).all()
            category_ids = list({p.category_id for p in ordered_products})

            # Recommend from those categories, exclude already ordered
            recs = (
                db.query(Product)
                .filter(
                    Product.category_id.in_(category_ids),
                    Product.id.notin_(ordered_product_ids),
                    Product.active == True,
                    Product.stock > 0,
                )
                .order_by(Product.selling_count.desc(), Product.rating.desc())
                .limit(limit)
                .all()
            )
            if recs:
                return [_fmt(p) for p in recs]

    # Default: featured + bestseller + high selling
    recs = (
        db.query(Product)
        .filter(Product.active == True, Product.stock > 0)
        .order_by(
            Product.is_featured.desc(),
            Product.is_bestseller.desc(),
            Product.selling_count.desc(),
        )
        .limit(limit)
        .all()
    )
    return [_fmt(p) for p in recs]


# ── Hot deals (discount >= 25%) ───────────────────────────────────────────────
@router.get("/hot-deals")
def get_hot_deals(
    limit: int = Query(12, ge=1, le=40),
    db: Session = Depends(get_db),
):
    products = (
        db.query(Product)
        .filter(Product.active == True, Product.stock > 0)
        .all()
    )
    hot = [p for p in products if p.discount >= 25]
    hot.sort(key=lambda p: p.discount, reverse=True)
    return [_fmt(p) for p in hot[:limit]]


# ── New arrivals (added in last 7 days) ───────────────────────────────────────
@router.get("/new-arrivals")
def get_new_arrivals(
    limit: int = Query(12, ge=1, le=40),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta, timezone
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    products = (
        db.query(Product)
        .filter(
            Product.active == True,
            Product.stock > 0,
            Product.created_at >= week_ago,
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
        .all()
    )
    return [_fmt(p) for p in products]

