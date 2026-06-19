
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.core.dependencies import require_admin
from app.models.user_model import User
from app.schemas.driver import DriverCreate, DriverUpdate, DriverOut, DriverListItem
from app.services import driver_service


router = APIRouter(
    prefix="/api/v1/admin/drivers",
    tags=["Admin — Drivers"]
)


@router.get("", response_model=list[DriverListItem])
def list_drivers(
    active_only: bool = Query(False),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Get all drivers"""
    return driver_service.get_all_drivers(db, active_only)


@router.post("", response_model=DriverOut, status_code=201)
def create_driver(
    data: DriverCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Create a new driver"""
    return driver_service.create_driver(db, data)


@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(
    driver_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Get a single driver by ID"""
    return driver_service.get_driver(db, driver_id)


@router.put("/{driver_id}", response_model=DriverOut)
def update_driver(
    driver_id: str,
    data: DriverUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Update a driver"""
    return driver_service.update_driver(db, driver_id, data)


@router.delete("/{driver_id}", status_code=204)
def delete_driver(
    driver_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Delete a driver (soft delete)"""
    driver_service.delete_driver(db, driver_id)


@router.patch("/{driver_id}/toggle-availability", response_model=DriverOut)
def toggle_availability(
    driver_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Toggle driver availability"""
    return driver_service.toggle_availability(db, driver_id)


@router.post("/{driver_id}/assign/{order_id}")
def assign_driver(
    driver_id: str,
    order_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Manually assign a driver to an order"""
    order = driver_service.assign_driver_to_order(db, order_id, driver_id)
    return {"message": "Driver assigned successfully", "order_id": order.id, "driver_id": driver_id}
