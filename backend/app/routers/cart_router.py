from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import  get_current_user  
from app.config.database import get_db
from app.services import cart_service
from app.schemas.cart_schema import CartItemCreate

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/")
def get_cart(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.get_cart(db, user["user_id"])  # ✅ payload based


@router.post("/add")
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.add_to_cart(db, user["user_id"], data.product_id, data.qty)


@router.patch("/update")
def update_cart(data: CartItemCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.update_cart(db, user["user_id"], data.product_id, data.qty)


@router.delete("/remove/{product_id}")
def remove(product_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return cart_service.remove_from_cart(db, user["user_id"], product_id)