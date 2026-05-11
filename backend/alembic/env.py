from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool
 
import sys
import os
 
# -------------------------------------------------
# ✅ Make backend root importable
# -------------------------------------------------
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)
 
# -------------------------------------------------
# ✅ Import settings & Base (MATCH YOUR STRUCTURE)
# -------------------------------------------------
from app.config.settings import settings
from app.config.database import Base
 
# -------------------------------------------------
# ✅ IMPORT ALL MODELS SO ALEMBIC CAN DETECT TABLES
# -------------------------------------------------
from app.models.user_model import User          # noqa
from app.models.otp_model import OTP            # noqa
from app.models.product_model import Product    # noqa
from app.models.category_model import Category  # noqa
from app.models.cart_model import Cart          # noqa
from app.models.cart_item_model import CartItem # noqa
from app.models.order_model import Order        # noqa
from app.models.order_item_model import OrderItem # noqa
 
# -------------------------------------------------
 
# Alembic Config object
config = context.config
 
# ✅ Use DATABASE_URL from settings
config.set_main_option("sqlalchemy.url",  settings.DATABASE_URL.replace("%", "%%"))
 
# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
 
# ✅ Metadata for autogeneration
target_metadata = Base.metadata
 
# -------------------------------------------------
 
def run_migrations_offline():
    """Run migrations in offline mode."""
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
 
    with context.begin_transaction():
        context.run_migrations()
 
 
def run_migrations_online():
    """Run migrations in online mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
 
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
 
        with context.begin_transaction():
            context.run_migrations()
 
 
# -------------------------------------------------
 
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()