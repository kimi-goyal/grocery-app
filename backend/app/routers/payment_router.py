from fastapi import APIRouter, HTTPException 
from app.schemas.payment_schema import (
    CreateOrderRequest,
    VerifyPaymentRequest
)
from app.services.razorpay_service import (
    create_razorpay_order,
    verify_payment_signature
)
from app.config.settings import settings

router = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/create-order")
def create_order(data: CreateOrderRequest):

    order = create_razorpay_order(data.amount)

    return {
        "success": True,
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key": settings.RAZORPAY_KEY_ID
    }


@router.post("/verify-payment")
def verify_payment(data: VerifyPaymentRequest):

    try:

        verify_payment_signature({
            "razorpay_order_id": data.razorpay_order_id,
            "razorpay_payment_id": data.razorpay_payment_id,
            "razorpay_signature": data.razorpay_signature
        })

        return {
            "success": True,
            "message": "Payment verified successfully"
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
