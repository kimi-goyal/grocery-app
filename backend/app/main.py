import os
from importlib.resources import files
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.lifespan import lifespan
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.config.database import Base, engine
from app.routers.auth_router import router as auth_router
from app.routers.cart_router import router as cart_router
from app.routers import (
    admin_product_router,
    admin_order_router,
    admin_customer_router,
    admin_dashboard_router,
    address_router, payment_router, order_router
)

from app.routers.coupon_router import admin_router as coupon_admin_router
from app.routers.coupon_router import user_router as coupon_user_router
from app.routers.coupon_router import push_router
from app.routers import payment_router 

app = FastAPI(
    title="QuickBite Backend",
    lifespan=lifespan,
    debug=True
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,  # ✅ REQUIRED FOR COOKIES
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ VALIDATION ERROR HANDLER — logs detailed validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    import sys
    print(f"❌ VALIDATION ERROR on {request.method} {request.url.path}", file=sys.stderr)
    print(f"   Body: {await request.body()}", file=sys.stderr)
    print(f"   Errors: {exc.errors()}", file=sys.stderr)
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router, prefix="/api/v1")
#app.include_router(product_router, prefix="/api/v1")
# app.include_router(admin_router, prefix="/api/v1")
# app.include_router(category_router, prefix="/api/v1")
app.include_router(cart_router, prefix="/api/v1")
# app.include_router(order_router, prefix="/api/v1")
# app.include_router(user_router, prefix="/api/v1")
app.include_router(admin_dashboard_router.router)
app.include_router(admin_product_router.router)
app.include_router(admin_order_router.router)
app.include_router(admin_customer_router.router)
app.include_router(payment_router.router)
app.include_router(address_router.router)
app.include_router(order_router.router)
app.include_router(coupon_admin_router)
app.include_router(coupon_user_router)
app.include_router(push_router)

# Add this to your existing main.py on_startup:

def create_tables():
    Base.metadata.create_all(bind=engine)


def init_firebase():
    import app.core.firebase_admin  # noqa: F401


@app.on_event("startup")
def on_startup():
    create_tables()
    init_firebase()

    # Start background scheduler for expiry push notifications
    from app.scheduler import start_scheduler
    start_scheduler()

    print("✅ FreshCart API started")

@app.get("/")
def health():
    return {"status": "OK"}