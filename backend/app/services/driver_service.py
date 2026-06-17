
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.driver import Driver
from app.models.order import Order, OrderStatus
from app.schemas.driver import DriverCreate, DriverUpdate
import random


def get_all_drivers(db: Session, active_only: bool = False) -> list[Driver]:
    """Get all drivers, optionally filter by active status"""
    q = db.query(Driver)
    if active_only:
        q = q.filter(Driver.is_active == True)
    return q.order_by(Driver.created_at.desc()).all()


def get_driver(db: Session, driver_id: str) -> Driver:
    """Get a single driver by ID"""
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found.")
    return driver


def create_driver(db: Session, data: DriverCreate) -> Driver:
    """Create a new driver"""
    # Check if phone already exists
    existing = db.query(Driver).filter(Driver.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="A driver with this phone number already exists.")
    
    driver = Driver(
        name=data.name,
        phone=data.phone,
        email=data.email,
        vehicle_number=data.vehicle_number,
        vehicle_type=data.vehicle_type,
    )
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


def update_driver(db: Session, driver_id: str, data: DriverUpdate) -> Driver:
    """Update a driver"""
    driver = get_driver(db, driver_id)
    
    # If phone is being updated, check uniqueness
    if data.phone and data.phone != driver.phone:
        existing = db.query(Driver).filter(Driver.phone == data.phone).first()
        if existing:
            raise HTTPException(status_code=400, detail="A driver with this phone number already exists.")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)
    
    db.commit()
    db.refresh(driver)
    return driver


def delete_driver(db: Session, driver_id: str) -> None:
    """Delete a driver (soft delete by marking inactive and removing from all orders)"""
    driver = get_driver(db, driver_id)
    
    # Unassociate driver from all orders
    orders = db.query(Order).filter(Order.driver_id == driver_id).all()
    for order in orders:
        order.driver_id = None
    
    driver.is_active = False
    db.commit()


def toggle_availability(db: Session, driver_id: str) -> Driver:
    """Toggle driver availability"""
    driver = get_driver(db, driver_id)
    driver.is_available = not driver.is_available
    db.commit()
    db.refresh(driver)
    return driver


def get_available_drivers(db: Session) -> list[Driver]:
    """Get all available and active drivers"""
    return db.query(Driver).filter(
        Driver.is_available == True,
        Driver.is_active == True
    ).all()


def assign_driver_to_order(db: Session, order_id: str, driver_id: str = None) -> Order:
    """
    Assign a driver to an order.
    If driver_id is None, automatically assigns a random available driver.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    if driver_id:
        # Manual assignment
        driver = get_driver(db, driver_id)
        if not driver.is_active:
            raise HTTPException(status_code=400, detail="Driver is not active.")
        order.driver_id = driver_id
    else:
        # Auto-assignment: pick a random available driver
        available_drivers = get_available_drivers(db)
        if not available_drivers:
            raise HTTPException(
                status_code=400,
                detail="No available drivers at the moment. Please try again later."
            )
        
        # Simple random assignment algorithm
        selected_driver = random.choice(available_drivers)
        order.driver_id = selected_driver.id
        
        # Increment driver's delivery count
        selected_driver.total_deliveries += 1
    
    db.commit()
    db.refresh(order)
    return order


def auto_assign_driver_on_status_change(db: Session, order: Order) -> None:
    """
    Automatically assign a driver when order status changes to 'On the Way'.
    This is called from the order service when status is updated.
    """
    # Only auto-assign if order is "On the Way" and no driver is assigned yet
    if order.status == OrderStatus.on_the_way and not order.driver_id:
        available_drivers = get_available_drivers(db)
        if available_drivers:
            # Simple random assignment
            selected_driver = random.choice(available_drivers)
            order.driver_id = selected_driver.id
            selected_driver.total_deliveries += 1
            db.commit()
