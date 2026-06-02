from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
 
from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.order import OrderOut, PaginatedOrders, RatingSubmit
from app.services.order_service import (
    get_user_orders, get_user_order_detail, submit_rating
)
 
router = APIRouter(prefix="/api/v1/orders", tags=["User — Orders"])
 
 
@router.get("/my", response_model=PaginatedOrders)
def my_orders(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_user_orders(db, user.id, status, page, limit)
 
 
@router.get("/my/{order_id}", response_model=OrderOut)
def my_order_detail(
    order_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    o = get_user_order_detail(db, order_id, user.id)
    return {**o.__dict__, "items_count": len(o.items)}
 
 
@router.post("/my/{order_id}/rate", response_model=OrderOut)
def rate_order(
    order_id: str,
    data: RatingSubmit,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    o = submit_rating(db, order_id, user.id, data)
    return {**o.__dict__, "items_count": len(o.items)}