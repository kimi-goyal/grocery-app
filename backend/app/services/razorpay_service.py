import os
import razorpay
from app.config.settings import settings
 
 
client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)
                         
def create_razorpay_order(amount: int):
 
    order = client.order.create({
        'amount': amount * 100,  # Amount in paise
        'currency': 'INR',
        'payment_capture': '1'  # Auto-capture payment
    })
 
    return order
 
def verify_payment_signature(data: dict):
    client.utility.verify_payment_signature(data)
    return True

