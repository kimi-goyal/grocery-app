"""
Admin User Setup Script
Run this script to create or update admin users in the database.
 
Usage:
    python scripts/setup_admin.py
 
Requirements:
    - Virtual environment activated
    - Database connection configured
"""
 
import sys
import os
from pathlib import Path
 
# Add the project root (backend/) to the path so Python can find the
# top-level `app` package when this script is run directly.
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
# Change working directory to project root so .env (and other relative files)
# are found when app settings load.
os.chdir(str(project_root))
 
from app.config.database import get_db
from app.models.user_model import User
from app.utils.password_handler import hash_password
 
 
def setup_admin_user(email: str, password: str, name: str = None):
    """
    Create or update a user with admin role.
 
    Args:
        email: User's email address
        password: Plain text password (will be hashed)
        name: User's display name (optional)
    """
    print(f"Setting up admin user: {email}")
 
    db = next(get_db())
 
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
 
    if user:
        print(f"User {email} already exists. Updating to admin role...")
        user.role = 'admin'
        if password:
            user.password_hash = hash_password(password)
        if name:
            user.name = name
    else:
        print(f"Creating new admin user: {email}")
        if not name:
            name = email.split('@')[0]  # Use part before @ as name
 
        user = User(
            name=name,
            email=email,
            username=email,  # Use email as username for simplicity
            password_hash=hash_password(password),
            role='admin',
            is_verified=True
        )
        db.add(user)
 
    db.commit()
    print(f"✅ Admin user {email} setup complete!")
 
 
def list_users():
    """List all users in the database."""
    print("\nCurrent users in database:")
    print("-" * 50)
 
    db = next(get_db())
    users = db.query(User).all()
 
    for user in users:
        print(f"ID: {user.id}")
        print(f"Name: {user.name}")
        print(f"Email: {user.email}")
        print(f"Username: {user.username}")
        print(f"Role: {user.role}")
        print(f"Verified: {user.is_verified}")
        print("-" * 30)
 
 
if __name__ == "__main__":
    print("🔧 FreshCart Admin User Setup Script")
    print("=" * 40)
 
    # Example usage - modify these values as needed
    admin_email = "hykimigoyal@gmail.com"
    admin_password = "admin123"
    admin_name = "Kimi Goyal"
 
    try:
        setup_admin_user(admin_email, admin_password, admin_name)
        list_users()
        print("\n🎉 Admin setup completed successfully!")
        print(f"Login credentials: {admin_email} / {admin_password}")
 
    except Exception as e:
        print(f"❌ Error setting up admin user: {e}")
        sys.exit(1)