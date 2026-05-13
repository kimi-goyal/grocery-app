# from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
# from sqlalchemy.orm import Session
# from app.dependencies.auth_dependencies import get_current_user, get_db
# from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductResponse
# from app.services.product_service import create_product_service, update_product_service, delete_product_service
# from app.utils.file_upload import save_product_image

# from app.schemas.category_schema import CategoryCreate
# from app.schemas.category_schema import CategoryUpdate
# from app.services.category_service import (
#     create_category_service,
#     update_category_service,
#     delete_category_service,
# )


# router = APIRouter(prefix="/admin", tags=["Admin"])

# def verify_admin(current_user: dict = Depends(get_current_user)):
#     if current_user.get("role") != "admin":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Admin access required",
#         )
#     return current_user

# @router.post("/products", response_model=ProductResponse)
# def create_product(
#     name: str = Form(...),
#     description: str | None = Form(None),
#     category_id: int | None = Form(None),
#     price: float = Form(...),
#     stock: int = Form(0),
#     image: UploadFile | None = File(None),
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(verify_admin),
# ):
#     image_path = save_product_image(image) if image else None
#     data = ProductCreate(
#         name=name,
#         description=description,
#         category_id=category_id,
#         price=price,
#         stock=stock,
#     )
#     return create_product_service(db, data, image_path)

# @router.put("/products/{product_id}", response_model=ProductResponse)
# def edit_product(
#     product_id: int,
#     name: str | None = Form(None),
#     description: str | None = Form(None),
#     category_id: int | None = Form(None),
#     price: float | None = Form(None),
#     stock: int | None = Form(None),
#     image: UploadFile | None = File(None),
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(verify_admin),
# ):
#     image_path = save_product_image(image) if image else None
#     data = ProductUpdate(
#         name=name,
#         description=description,
#         category_id=category_id,
#         price=price,
#         stock=stock,
#     )
#     product = update_product_service(db, product_id, data, image_path)
#     if not product:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Product not found",
#         )
#     return product


# @router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_product(
#     product_id: int,
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(verify_admin),
# ):
#     success = delete_product_service(db, product_id)
#     if not success:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Product not found",
#         )
#     return None

# from app.schemas.category_schema import CategoryCreate
# from app.services.category_service import create_category_service

# @router.post("/categories")
# def create_category(
#     data: CategoryCreate,
#     db: Session = Depends(get_db),
#     admin=Depends(verify_admin)
# ):
#     return create_category_service(db, data)




# @router.put("/categories/{category_id}")
# def update_category(
#     category_id: int,
#     data: CategoryUpdate,
#     db: Session = Depends(get_db),
#     admin=Depends(verify_admin),
# ):
#     return update_category_service(db, category_id, data)



# @router.delete(
#     "/categories/{category_id}",
#     status_code=status.HTTP_204_NO_CONTENT
# )
# def delete_category(
#     category_id: int,
#     db: Session = Depends(get_db),
#     admin=Depends(verify_admin),
# ):
#     delete_category_service(db, category_id)
#     return None