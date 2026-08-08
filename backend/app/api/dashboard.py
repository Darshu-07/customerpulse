from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import DashboardSummary
from app.analytics.descriptive import get_dashboard_summary

router = APIRouter()

@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    summary = get_dashboard_summary(db)
    return summary
