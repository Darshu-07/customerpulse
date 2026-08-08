from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.schemas import ChurnSummary, HighRiskCustomer
from app.analytics.descriptive import get_churn_rates
from app.analytics.diagnostic import get_churn_by_dimension
from app.models.database import Customer, CustomerAnalytics

router = APIRouter()

@router.get("/summary", response_model=ChurnSummary)
def get_summary(db: Session = Depends(get_db)):
    return get_churn_rates(db)

@router.get("/high-risk", response_model=List[HighRiskCustomer])
def get_high_risk(limit: int = 50, db: Session = Depends(get_db)):
    customers = db.query(Customer, CustomerAnalytics).join(CustomerAnalytics).filter(
        CustomerAnalytics.risk_level.in_(['High', 'Critical'])
    ).order_by(CustomerAnalytics.churn_probability.desc()).limit(limit).all()
    
    res = []
    for c, a in customers:
        res.append({
            "customer_id": c.customer_id,
            "risk_level": a.risk_level,
            "churn_probability": a.churn_probability,
            "revenue_at_risk": a.revenue_at_risk,
            "top_drivers": a.top_churn_drivers if a.top_churn_drivers else []
        })
    return res

@router.get("/analytics")
def get_analytics(group_by: str, db: Session = Depends(get_db)):
    return get_churn_by_dimension(db, group_by)
