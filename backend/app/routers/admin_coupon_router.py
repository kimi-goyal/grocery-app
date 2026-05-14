
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.coupon import CouponCreate, CouponUpdate, CouponOut, CouponValidate, CouponValidateResponse
from app.services import coupon_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Coupons"])


@router.get("/coupons", response_model=list[CouponOut])
def list_coupons(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return coupon_service.get_all_coupons(db)


@router.post("/coupons", response_model=CouponOut, status_code=201)
def create_coupon(
    data: CouponCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return coupon_service.create_coupon(db, data)


@router.put("/coupons/{coupon_id}", response_model=CouponOut)
def update_coupon(
    coupon_id: str,
    data: CouponUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return coupon_service.update_coupon(db, coupon_id, data)


@router.patch("/coupons/{coupon_id}/toggle", response_model=CouponOut)
def toggle_coupon(coupon_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return coupon_service.toggle_coupon(db, coupon_id)


@router.delete("/coupons/{coupon_id}", status_code=204)
def delete_coupon(coupon_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    coupon_service.delete_coupon(db, coupon_id)


# Public endpoint — used by checkout to validate coupons
@router.post("/coupons/validate", response_model=CouponValidateResponse, tags=["Public"])
def validate_coupon(data: CouponValidate, db: Session = Depends(get_db)):
    return coupon_service.validate_coupon(db, data.code, data.order_amount)
