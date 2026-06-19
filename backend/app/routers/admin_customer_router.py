
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.config.database import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.customer import PaginatedCustomers
from app.services import customer_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin — Customers"])


@router.get("/customers", response_model=PaginatedCustomers)
def list_customers(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return customer_service.get_customers(db, search, page, limit)

