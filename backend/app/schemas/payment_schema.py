from pydantic import BaseModel
 
class CreateOrderRequest(BaseModel):
    amount: int
   
 
class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str