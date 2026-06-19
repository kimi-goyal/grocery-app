from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.dependencies.auth_dependencies import get_current_user
from app.models.address import Address
from app.models.user_model import User
from app.schemas.address import AddressCreate, AddressOut
from fastapi import HTTPException

router = APIRouter(prefix="/api/v1/addresses", tags=["Addresses"])


@router.get("", response_model=list[AddressOut])
def get_addresses(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Address).filter(Address.user_id == user["user_id"]).order_by(Address.created_at).all()


# @router.post("", response_model=AddressOut, status_code=201)
# def create_address(
#     data: AddressCreate,
#     db: Session = Depends(get_db),
#     user: User = Depends(get_current_user),
# ):
#     # If first address, make it default
#     count = db.query(Address).filter(Address.user_id == user["user_id"]).count()
#     addr = Address(user_id=user["user_id"], is_default=(count == 0), **data.model_dump())
#     db.add(addr)
#     db.commit()
#     db.refresh(addr)
#     return addr

@router.post("", response_model=AddressOut, status_code=201)
def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    count = db.query(Address).filter(
        Address.user_id == user["user_id"]
    ).count()

    addr = Address(
        user_id=user["user_id"],
        is_default=(count == 0),
        **data.model_dump()
    )

    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.delete("/{address_id}", status_code=204)
def delete_address(
    address_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == user["user_id"]).first()
    if not addr:
        
        raise HTTPException(status_code=404, detail="Address not found.")
    db.delete(addr)
    db.commit()


@router.patch("/{address_id}/default", response_model=AddressOut)
def set_default_address(
    address_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Unset all defaults for user
    db.query(Address).filter(Address.user_id == user["user_id"]).update({"is_default": False})
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == user["user_id"]).first()
    if not addr:
       
        raise HTTPException(status_code=404, detail="Address not found.")
    addr.is_default = True
    db.commit()
    db.refresh(addr)
    return addr
