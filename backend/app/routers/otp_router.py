from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.otp_schema import SendOtpRequest, VerifyOtpRequest
from app.services.otp_service import send_otp, verify_otp_code
from app.dependencies.auth_dependencies import get_db

router = APIRouter(
    prefix="/otp",
    tags=["OTP"]
)


@router.post("/send")
async def send_otp_api(
    payload: SendOtpRequest,
    db: Session = Depends(get_db)
):
    try:
        await send_otp(
            db=db,
            email=payload.email,
            purpose=payload.purpose
        )
        return {
            "message": "OTP sent successfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/resend")
async def resend_otp_api(
    payload: SendOtpRequest,
    db: Session = Depends(get_db)
):
    try:
        await send_otp(
            db=db,
            email=payload.email,
            purpose=payload.purpose
        )
        return {
            "message": "OTP resent successfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/verify")
def verify_otp_api(
    payload: VerifyOtpRequest,
    db: Session = Depends(get_db)
):
    try:
        verify_otp_code(
            db=db,
            email=payload.email,
            otp_input=payload.otp,
            purpose=payload.purpose
        )
        return {
            "message": "OTP verified successfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )