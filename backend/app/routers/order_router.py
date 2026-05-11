from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth_dependencies import get_db, get_current_user
from app.schemas.order_schema import OrderResponse
from app.services.order_service import (
    create_order_from_cart_service,
    get_orders_service,
    get_order_detail_service,
    order_tracking_service,
)

router = APIRouter(prefix="/orders", tags=["Orders"])


# ✅ CHECKOUT
@router.post("/create", response_model=OrderResponse)
def create_order(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return create_order_from_cart_service(
        db,
        current_user["user_id"],
    )


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_orders_service(db, current_user["user_id"])


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_order_detail_service(
        db,
        current_user["user_id"],
        order_id,
    )


@router.get("/{order_id}/tracking")
def track_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return order_tracking_service(
        db,
        current_user["user_id"],
        order_id,
    )