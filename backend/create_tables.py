import sys
sys.path.insert(0, '/app')

from app.config.database import Base, engine
from app.models.callback_request import CallbackRequest

# Create all tables
Base.metadata.create_all(bind=engine)
print("✓ Database tables created successfully")
print("✓ callback_requests table is ready")
