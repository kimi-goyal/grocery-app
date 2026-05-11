# from argon2 import PasswordHasher
# from argon2.exceptions import VerifyMismatchError

# _hasher = PasswordHasher()


# def hash_password(password: str) -> str:
#     return _hasher.hash(password)


# def verify_password(password: str, hashed_password: str) -> bool:
#     try:
#         _hasher.verify(hashed_password, password)
#         return True
#     except VerifyMismatchError:
#         return False
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)