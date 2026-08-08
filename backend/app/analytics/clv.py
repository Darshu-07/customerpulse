from app.models.database import Customer, CustomerAnalytics
from sqlalchemy import func

def calculate_clv(customer_dict: dict, churn_prob: float):
    mc = customer_dict.get('monthly_charges', 0)
    cp = max(churn_prob, 0.01)
    clv = mc * (1 / cp) * 12
    return min(clv, 10000) # cap

def get_clv_summary(db):
    avg_clv = db.query(func.avg(CustomerAnalytics.predicted_clv)).scalar() or 0.0
    return {
        "avg_clv": avg_clv,
        "median_clv": avg_clv,
        "by_segment": {},
        "by_subscription": {}
    }
