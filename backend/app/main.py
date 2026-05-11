from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.lifespan import lifespan

from app.routers.auth_router import router as auth_router
from app.routers.product_router import router as product_router
from app.routers.admin_router import router as admin_router
from app.routers.category_router import router as category_router
from app.routers.cart_router import router as cart_router
from app.routers.order_router import router as order_router
from app.routers.user_router import router as user_router

app = FastAPI(
    title="QuickBite Backend",
    lifespan=lifespan,
    debug=True
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(product_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(category_router, prefix="/api/v1")
app.include_router(cart_router, prefix="/api/v1")
app.include_router(order_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")

@app.get("/")
def health():
    return {"status": "OK"}