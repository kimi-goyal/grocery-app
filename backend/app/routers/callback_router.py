from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.config.database import get_db
from app.dependencies.auth_dependencies import get_current_user
from app.models.callback_request import CallbackRequest
from app.schemas.user_schema import UserResponse
from app.config.settings import settings
 
logger = logging.getLogger(__name__)
 
router = APIRouter(
    prefix="/callback",
    tags=["callback"],
)
 
 
class CallbackRequestCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: Optional[str] = None
 
 
class CallbackRequestResponse(BaseModel):
    id: int
    user_id: Optional[int]
    name: str
    email: str
    phone: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
 
    class Config:
        from_attributes = True
 
 
def send_email_to_admin(callback_request: CallbackRequest, recipient_email: str = "vidishakharbanda20@gmail.com"):
    """Send email notification to admin about callback request"""
    try:
        subject = f"New Callback Request from {callback_request.name}"
       
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-bottom: 20px;">New Callback Request</h2>
                   
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>User Number:</strong> {callback_request.user_id or 'N/A'}</p>
                        <p style="margin: 10px 0;"><strong>Name:</strong> {callback_request.name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> {callback_request.email}</p>
                        <p style="margin: 10px 0;"><strong>Phone:</strong> {callback_request.phone or 'N/A'}</p>
                        <p style="margin: 10px 0;"><strong>Message:</strong> {callback_request.message or 'No message provided'}</p>
                        <p style="margin: 10px 0;"><strong>Requested At:</strong> {callback_request.created_at}</p>
                    </div>
                   
                    <p style="color: #666; font-size: 14px;">Please follow up with the customer as soon as possible.</p>
                </div>
            </body>
        </html>
        """
       
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_ADDRESS
        msg["To"] = recipient_email
       
        msg.attach(MIMEText(body, "html"))
       
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
            server.send_message(msg)
       
        logger.info(f"Email sent for callback request {callback_request.id}")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        # Don't raise - email is optional
        return False
 
 
@router.post("/request", response_model=CallbackRequestResponse)
async def create_callback_request(
    callback_data: CallbackRequestCreate,
    db: Session = Depends(get_db),
):
    """Create a callback request (authenticated or guest users)"""
    try:
        # Create callback request
        callback_request = CallbackRequest(
            name=callback_data.name,
            email=callback_data.email,
            phone=callback_data.phone,
            message=callback_data.message,
            status="pending",
        )
       
        db.add(callback_request)
        db.commit()
        db.refresh(callback_request)
       
        # Send email to admin (non-blocking)
        send_email_to_admin(callback_request)
       
        logger.info(f"Callback request created: {callback_request.id}")
        return callback_request
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating callback request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create callback request: {str(e)}"
        )
 
 
@router.post("/guest-request", response_model=CallbackRequestResponse)
async def create_guest_callback_request(
    callback_data: CallbackRequestCreate,
    db: Session = Depends(get_db),
):
    """Create a callback request for guest users (no authentication required)"""
    try:
        # Create callback request
        callback_request = CallbackRequest(
            name=callback_data.name,
            email=callback_data.email,
            phone=callback_data.phone,
            message=callback_data.message,
            status="pending",
        )
       
        db.add(callback_request)
        db.commit()
        db.refresh(callback_request)
       
        # Send email to admin (non-blocking)
        send_email_to_admin(callback_request)
       
        return callback_request
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating guest callback request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create callback request: {str(e)}"
        )
 
 
@router.get("/pending")
async def get_pending_callbacks(
    db: Session = Depends(get_db),
):
    """Get all pending callback requests (admin only)"""
    try:
        callbacks = db.query(CallbackRequest).filter(
            CallbackRequest.status == "pending"
        ).order_by(CallbackRequest.created_at.desc()).all()
       
        return callbacks
    except Exception as e:
        logger.error(f"Error fetching callbacks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch callbacks: {str(e)}"
        )
 
 
@router.put("/{callback_id}/status")
async def update_callback_status(
    callback_id: int,
    status_update: dict,
    db: Session = Depends(get_db),
):
    """Update callback request status"""
    try:
        callback = db.query(CallbackRequest).filter(
            CallbackRequest.id == callback_id
        ).first()
       
        if not callback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Callback request not found"
            )
       
        callback.status = status_update.get("status", callback.status)
        db.commit()
        db.refresh(callback)
       
        return callback
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating callback: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update callback: {str(e)}"
        )
 
 