import hashlib
import random


def generate_otp(length: int = 6) -> tuple[str, str]:
    otp_plain = ''.join(str(random.randint(0, 9)) for _ in range(length))
    otp_hash = hashlib.sha256(otp_plain.encode()).hexdigest()
    return otp_plain, otp_hash


def verify_otp(otp_input: str, otp_hash: str) -> bool:
    return hashlib.sha256(otp_input.encode()).hexdigest() == otp_hash
