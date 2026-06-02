import uuid
from pathlib import Path
from fastapi import UploadFile

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads" / "products"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_product_image(image: UploadFile) -> str:
    """Save a product image upload and return the relative image path."""
    extension = Path(image.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    with file_path.open("wb") as buffer:
        buffer.write(image.file.read())

    return str(Path("uploads") / "products" / filename)
