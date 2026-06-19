from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import get_current_user
from app.config.database import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserResponse
from pydantic import BaseModel
import os
from pathlib import Path

router = APIRouter()

class UpdateUserPayload(BaseModel):
    name: str | None = None
    phone: str | None = None

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(
    payload: UpdateUserPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.name:
        current_user.name = payload.name
    if payload.phone:
        current_user.phone = payload.phone
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure uploads directory exists
    uploads_dir = Path("uploads/avatars")
    uploads_dir.mkdir(parents=True, exist_ok=True)

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Save file
    file_path = uploads_dir / f"{current_user.id}_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # Update user avatar
    current_user.avatar = str(file_path)
    db.commit()

    return {"message": "Avatar uploaded successfully", "avatar": str(file_path)}