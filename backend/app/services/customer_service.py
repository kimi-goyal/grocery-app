from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.address import Address
from app.models.order import Order, OrderStatus
 
 
def get_customers(
    db: Session,
    search: str = None,
    page: int = 1,
    limit: int = 50,
) -> dict:
    q = db.query(User).filter(
        User.role != "admin",
    )
 
    if search:
        q = q.filter(
            User.name.ilike(f"%{search}%") |
            User.email.ilike(f"%{search}%") |
            User.username.ilike(f"%{search}%")
        )
 
    q = q.order_by(User.created_at.desc())
    total = q.count()
    users = q.offset((page - 1) * limit).limit(limit).all()
 
    result = []
    for user in users:
        orders = db.query(Order).filter(
            Order.user_id == user.id,
            Order.status != OrderStatus.cancelled,
        ).all()
        default_address = db.query(Address).filter(
            Address.user_id == user.id,
            Address.is_default == True,
        ).first()
        phone = default_address.phone if default_address else user.phone
        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "phone": phone,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "provider": user.provider,
            "profile_image": getattr(user, 'avatar', None),
            "order_count": len(orders),
            "total_spent": round(sum(o.total_amount for o in orders), 2),
            "joined_date": user.created_at.strftime("%d %b %Y") if getattr(user, 'created_at', None) else "",
            "status": "Active" if user.is_active else "Inactive",
        })
 
    return {
        "customers": result,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }
 