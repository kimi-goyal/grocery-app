# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.dependencies.auth_dependencies import get_db, get_current_user
# from app.schemas.order_schema import OrderResponse
# from app.services.order_service import (
#     create_order_from_cart_service,
#     get_orders_service,
#     get_order_detail_service,
#     order_tracking_service,
# )

# router = APIRouter(prefix="/orders", tags=["Orders"])


# # ✅ CHECKOUT
# @router.post("/create", response_model=OrderResponse)
# def create_order(
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     return create_order_from_cart_service(
#         db,
#         current_user["user_id"],
#     )


# @router.get("/", response_model=list[OrderResponse])
# def get_orders(
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     return get_orders_service(db, current_user["user_id"])


# @router.get("/{order_id}", response_model=OrderResponse)
# def get_order(
#     order_id: int,
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     return get_order_detail_service(
#         db,
#         current_user["user_id"],
#         order_id,
#     )


# @router.get("/{order_id}/tracking")
# def track_order(
#     order_id: int,
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     return order_tracking_service(
#         db,
#         current_user["user_id"],
#         order_id,
#     )

import uuid
import hmac
import hashlib
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import razorpay
from sqlalchemy import delete
from app.dependencies.auth_dependencies import get_db
from app.dependencies.auth_dependencies import get_current_user
from app.models.user_model import User
from app.models.order import Order, OrderItem, OrderStatus
from app.models.address import Address
from app.services.coupon_service import validate_coupon
from app.models.cart import CartItem

from app.config.settings import settings



router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])

RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET

class PlaceOrderRequest(BaseModel):
    address_id: int
    payment_method: str # 'razorpay' | 'cod'
    coupon_code: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None


class RazorpayCreateRequest(BaseModel):
    amount: float


@router.post("/razorpay/create")
def create_razorpay_order(
    data: RazorpayCreateRequest,
    user=Depends(get_current_user),
):
    if not RAZORPAY_KEY_ID:
        raise HTTPException(503, "Razorpay not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

    order = client.order.create({
        "amount": int(data.amount * 100),
        "currency": "INR",
        "payment_capture": 1,
    })

    # ✅ IMPORTANT: return like OLD WORKING FLOW
    return {
        "id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key": RAZORPAY_KEY_ID   # ✅ ADD THIS
    }



@router.post("")
def place_order(
    data: PlaceOrderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Validate address belongs to user
    addr = db.query(Address).filter(Address.id == data.address_id, Address.user_id == user["user_id"]).first()
    if not addr:
        raise HTTPException(404, "Address not found.")

    # Verify Razorpay signature
    if data.payment_method == "razorpay":
        if not all([data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature]):
            raise HTTPException(400, "Missing Razorpay payment details.")
        body = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(), body.encode(), hashlib.sha256
        ).hexdigest()
        if expected != data.razorpay_signature:
            raise HTTPException(400, "Payment verification failed.")

    # Fetch cart from DB (you have a cart model)
  
    # cart_items = db.query(CartItem).filter(CartItem.user_id == user["user_id"]).all()
    # if not cart_items:
    #     raise HTTPException(400, "Cart is empty.")

    # # Calculate totals
    # subtotal = sum(item.price * item.qty for item in cart_items)

    cart_items = (
        db.query(CartItem)
        .filter(CartItem.user_id == user["user_id"])
        .all()
    )

    if not cart_items:
        raise HTTPException(400, "Cart is empty.")

    # ✅ calculate from PRODUCT (correct way)
    subtotal = sum(ci.product.price * ci.qty for ci in cart_items)
    delivery = 0.0 if subtotal >= 299 else 20.0
    discount = 0.0

    if data.coupon_code:
        result = validate_coupon(db, data.coupon_code, subtotal)
        if result["valid"]:
            discount = result["discount_amount"]
            # Increment used_count
            from app.models.coupon import Coupon
            c = db.query(Coupon).filter(Coupon.code == data.coupon_code.upper()).first()
            if c:
                c.used_count += 1
                db.flush()

    total = subtotal + delivery - discount

    # Create order
    # ✅ Fetch full user from DB
    db_user = db.query(User).filter(User.id == user["user_id"]).first()
    if not db_user:
        raise HTTPException(404, "User not found")

    # ✅ Create order
    order_number = f"FC{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_number=order_number,
        user_id=user["user_id"],
        customer_name=db_user.name,
        email=db_user.email,
        phone=addr.phone,
        address=f"{addr.line1}, {addr.line2 or ''}, {addr.tag}".strip(", "),
        total_amount=round(total, 2),
        status=OrderStatus.pending,
        coupon_code=data.coupon_code or None,
        discount_amount=discount,
        delivery_fee=delivery,
    )

    db.add(order)
    db.flush()
    # Create order items (snapshot)
    for ci in cart_items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=ci.product_id,
            name=ci.product.name,              # ✅ FIXED
            price=ci.product.price,            # ✅ FIXED
            quantity=ci.qty,
            unit=ci.product.unit if hasattr(ci.product, "unit") else "",
            image_url=ci.product.image_url if hasattr(ci.product, "image_url") else "",
        ))

    # Clear cart
   
    db.execute(delete(CartItem).where(CartItem.user_id == user["user_id"]))
    db.commit()

    return {"order_number": order_number, "total": total, "status": "Pending"}
