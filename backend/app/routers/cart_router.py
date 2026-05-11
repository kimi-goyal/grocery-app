from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth_dependencies import get_db
from app.dependencies.auth_dependencies import get_current_user
from app.schemas.cart_schema import CartAddRequest, CartResponse
from app.services.cart_service import (
    get_cart_service,
    add_to_cart_service,
    update_cart_service,
    remove_from_cart_service,
)

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_cart_service(db, current_user["user_id"])


@router.post("/add")
def add_to_cart(
    data: CartAddRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return add_to_cart_service(
        db,
        current_user["user_id"],
        data.product_id,
        data.quantity,
    )


@router.put("/update")
def update_cart(
    data: CartAddRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return update_cart_service(
        db,
        current_user["user_id"],
        data.product_id,
        data.quantity,
    )


@router.delete("/remove")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return remove_from_cart_service(
        db,
        current_user["user_id"],
        product_id,
    )