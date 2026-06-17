
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, func, Integer
from sqlalchemy.orm import relationship
from app.config.database import Base


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), nullable=True)
    vehicle_number = Column(String(50), nullable=True)
    vehicle_type = Column(String(50), nullable=True)  # bike, car, etc.
    is_available = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    total_deliveries = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to orders
    orders = relationship("Order", back_populates="driver")
