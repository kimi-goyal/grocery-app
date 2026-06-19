
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