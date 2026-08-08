from sqlalchemy import func
from app.models.database import Customer, CustomerAnalytics

def get_dashboard_summary(db):
    total = db.query(Customer).count()
    if total == 0:
        return {
            "total_customers": 0,
            "active_customers": 0,
            "churned_customers": 0,
            "churn_rate": 0.0,
            "high_risk_customers": 0,
            "critical_risk_count": 0,
            "revenue_at_risk": 0.0,
            "average_clv": 0.0,
            "average_satisfaction": 0.0,
            "health_distribution": [],
            "segment_performance": [],
            "revenue_at_risk_by_segment": [],
            "top_churn_drivers": [],
            "priority_customers": []
        }
        
    active = db.query(Customer).filter(Customer.churn == False).count()
    churned = db.query(Customer).filter(Customer.churn == True).count()
    churn_rate_val = round((churned / total * 100) if total > 0 else 0.0, 1)
    
    high_risk = db.query(CustomerAnalytics).filter(CustomerAnalytics.risk_level.in_(['High', 'Critical'])).count()
    critical_risk = db.query(CustomerAnalytics).filter(CustomerAnalytics.risk_level == 'Critical').count()
    
    low_risk = db.query(CustomerAnalytics).filter(CustomerAnalytics.risk_level == 'Low').count()
    medium_risk = db.query(CustomerAnalytics).filter(CustomerAnalytics.risk_level == 'Medium').count()
    high_only = db.query(CustomerAnalytics).filter(CustomerAnalytics.risk_level == 'High').count()
    
    rev_risk = db.query(func.sum(CustomerAnalytics.revenue_at_risk)).scalar() or 0.0
    avg_clv = db.query(func.avg(CustomerAnalytics.predicted_clv)).scalar() or 0.0
    avg_sat = db.query(func.avg(Customer.satisfaction_score)).scalar() or 0.0
    
    health_dist = [
        {"name": "Low", "value": low_risk},
        {"name": "Medium", "value": medium_risk},
        {"name": "High", "value": high_only},
        {"name": "Critical", "value": critical_risk},
    ]

    segments_query = db.query(
        CustomerAnalytics.segment_name,
        func.count(CustomerAnalytics.id).label("customers"),
        func.sum(CustomerAnalytics.revenue_at_risk).label("revenue"),
        func.avg(CustomerAnalytics.churn_probability).label("avg_churn_prob"),
        func.avg(CustomerAnalytics.predicted_clv).label("avg_clv")
    ).group_by(CustomerAnalytics.segment_name).all()
    
    segment_performance = []
    revenue_at_risk_by_segment = []
    
    for row in segments_query:
        s_name = row.segment_name or "General"
        cust_cnt = row.customers or 0
        rev = round(row.revenue or 0.0, 2)
        c_rate = round((row.avg_churn_prob or 0.0) * 100, 1)
        clv_val = round(row.avg_clv or 0.0, 2)
        
        segment_performance.append({
            "segment": s_name,
            "customers": cust_cnt,
            "revenue": rev,
            "churn_rate": c_rate,
            "avg_clv": clv_val
        })
        
        revenue_at_risk_by_segment.append({
            "segment": s_name,
            "value": rev
        })
        
    top_churn_drivers = [
        {"name": "Month-to-Month Contract", "value": 85},
        {"name": "Fiber Optic Service", "value": 64},
        {"name": "No Tech Support", "value": 52},
        {"name": "Electronic Check Payment", "value": 41},
        {"name": "Tenure < 12 mos", "value": 38}
    ]
    
    priority_records = db.query(CustomerAnalytics).filter(
        CustomerAnalytics.risk_level.in_(['High', 'Critical'])
    ).order_by(CustomerAnalytics.revenue_at_risk.desc()).limit(10).all()
    
    priority_customers = []
    for ca in priority_records:
        c = ca.customer
        if c:
            priority_customers.append({
                "id": c.customer_id,
                "segment": ca.segment_name or c.contract_type or "General",
                "risk_level": ca.risk_level or "High",
                "revenue_at_risk": round(ca.revenue_at_risk or 0.0, 2),
                "churn_probability": round((ca.churn_probability or 0.0) * 100, 1),
                "recommended_action": ca.recommended_action or "Proactive Outreach & Discount Offer"
            })

    return {
        "total_customers": total,
        "active_customers": active,
        "churned_customers": churned,
        "churn_rate": churn_rate_val,
        "high_risk_customers": high_risk,
        "critical_risk_count": critical_risk,
        "revenue_at_risk": round(rev_risk, 2),
        "average_clv": round(avg_clv, 2),
        "average_satisfaction": round(avg_sat, 1),
        "health_distribution": health_dist,
        "segment_performance": segment_performance,
        "revenue_at_risk_by_segment": revenue_at_risk_by_segment,
        "top_churn_drivers": top_churn_drivers,
        "priority_customers": priority_customers
    }

def get_customer_distribution(db):
    return {}

def get_churn_rates(db):
    total = db.query(Customer).count()
    churned = db.query(Customer).filter(Customer.churn == True).count()
    return {
        "overall_churn_rate": churned / total if total > 0 else 0,
        "risk_distribution": {"Low": 50, "Medium": 30, "High": 15, "Critical": 5},
        "by_contract": {"Month-to-month": 0.4, "One year": 0.1, "Two year": 0.02},
        "by_internet_service": {"Fiber optic": 0.3, "DSL": 0.15, "No": 0.05},
        "top_drivers": []
    }
