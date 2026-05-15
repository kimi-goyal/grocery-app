from importlib.resources import files

from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.lifespan import lifespan
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.routers.auth_router import router as auth_router
# #from app.routers.product_router import router as product_router
# from app.routers.admin_router import router as admin_router
# from app.routers.category_router import router as category_router
from app.routers.cart_router import router as cart_router
# from app.routers.order_router import router as order_router
# from app.routers.user_router import router as user_router
from app.routers import (
    admin_product_router,
    admin_order_router,
    admin_customer_router,
    admin_coupon_router,
    admin_dashboard_router,
)

import app.core.firebase_admin
from app.routers import payment_router  # Initialize Firebase Admin SDK

app = FastAPI(
    title="QuickBite Backend",
    lifespan=lifespan,
    debug=True
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ frontend URL
    allow_credentials=True,  # ✅ REQUIRED FOR COOKIES
    allow_methods=["*"],
    allow_headers=["*"],
)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


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
app.include_router(admin_coupon_router.router)
app.include_router(payment_router.router)


@app.get("/")
def health():
    return {"status": "OK"}