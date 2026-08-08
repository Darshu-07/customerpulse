from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import RevenueAtRisk
from app.analytics.revenue_risk import calculate_revenue_at_risk
from app.analytics.clv import get_clv_summary

router = APIRouter()

@router.get("", response_model=RevenueAtRisk)
def get_revenue_risk(db: Session = Depends(get_db)):
    return calculate_revenue_at_risk(db)

@router.get("/clv/summary")
def get_clv(db: Session = Depends(get_db)):
    return get_clv_summary(db)
