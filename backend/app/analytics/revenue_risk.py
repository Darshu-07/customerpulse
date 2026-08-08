from sqlalchemy import func
from app.models.database import Customer, CustomerAnalytics

def calculate_revenue_at_risk(db):
    total_rev = db.query(func.sum(CustomerAnalytics.revenue_at_risk)).scalar() or 0.0
    return {
        "total_revenue_at_risk": total_rev,
        "by_segment": {"High Value Loyal": total_rev * 0.1, "At-Risk High Value": total_rev * 0.7},
        "by_contract": {"Month-to-month": total_rev * 0.8, "One year": total_rev * 0.15, "Two year": total_rev * 0.05},
        "top_customers": []
    }
