import random
import hashlib

def generate_otp():
    otp = str(random.randint(100000, 999999))

    otp_hash = hashlib.sha256(otp.encode()).hexdigest()

    return otp, otp_hash


def verify_otp(otp_input: str, otp_hash: str) -> bool:
    return hashlib.sha256(otp_input.encode()).hexdigest() == otp_hash
