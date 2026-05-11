# from email.message import EmailMessage

# from aiosmtplib import send

# from app.config.settings import settings


# async def send_otp_email(to_email: str, otp_code: str) -> None:
#     message = EmailMessage()
#     message["From"] = settings.EMAIL_ADDRESS
#     message["To"] = to_email
#     message["Subject"] = "Your OTP Code"
#     message.set_content(
#         f"Your OTP code is {otp_code}.\n\nUse this code within 5 minutes to complete your request."
#     )

#     await send(
#         message,
#         hostname=settings.SMTP_SERVER,
#         port=settings.SMTP_PORT,
#         username=settings.EMAIL_ADDRESS,
#         password=settings.EMAIL_PASSWORD,
#         start_tls=True,
#     )
import smtplib
from email.message import EmailMessage
from app.config.settings import settings


def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: str | None = None,
):
    msg = EmailMessage()
    msg["From"] = settings.EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.set_content(plain_text)

    if html_content:
        msg.add_alternative(html_content, subtype="html")

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
        server.send_message(msg)