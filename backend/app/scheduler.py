"""
APScheduler — runs expiry warning cron every hour.
Add to main.py startup.

Install: pip install apscheduler
"""
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.config.database import SessionLocal
from app.services.coupon_service import cleanup_expired_coupons, send_expiry_warnings


def start_scheduler():
    scheduler = BackgroundScheduler()

    def cleanup_job():
        db = SessionLocal()
        try:
            removed = cleanup_expired_coupons(db)
            if removed:
                print(f"[Scheduler] Removed {removed} expired coupons")
        finally:
            db.close()

    def warning_job():
        db = SessionLocal()
        try:
            sent = send_expiry_warnings(db)
            if sent:
                print(f"[Scheduler] Sent {sent} expiry warning pushes")
        finally:
            db.close()

    scheduler.add_job(cleanup_job, IntervalTrigger(minutes=5), id="cleanup_expired_coupons", replace_existing=True)
    scheduler.add_job(warning_job, IntervalTrigger(hours=1), id="expiry_warnings", replace_existing=True)
    scheduler.start()
    print("[Scheduler] Started — expired coupon cleanup every 5 minutes and expiry warnings every hour")
    return scheduler


