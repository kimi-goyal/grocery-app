"""
APScheduler — runs expiry warning cron every hour.
Add to main.py startup.

Install: pip install apscheduler
"""
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.config.database import SessionLocal
from app.services.coupon_service import send_expiry_warnings


def start_scheduler():
    scheduler = BackgroundScheduler()

    def job():
        db = SessionLocal()
        try:
            sent = send_expiry_warnings(db)
            if sent:
                print(f"[Scheduler] Sent {sent} expiry warning pushes")
        finally:
            db.close()

    scheduler.add_job(job, IntervalTrigger(hours=1), id="expiry_warnings", replace_existing=True)
    scheduler.start()
    print("[Scheduler] Started — expiry warnings every hour")
    return scheduler


