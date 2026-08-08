from app.models.database import Customer, CustomerAnalytics

def generate_recommendations(db):
    high_risk = db.query(Customer, CustomerAnalytics).join(CustomerAnalytics).filter(CustomerAnalytics.churn_probability > 0.3).all()
    recommendations = []
    
    for c, a in high_risk:
        rec = "Standard retention campaign"
        if a.customer_value_score and a.customer_value_score > 70 and a.churn_probability > 0.6:
            rec = "Priority retention intervention — personal account review"
        elif a.engagement_score and a.engagement_score < 30 and a.churn_probability > 0.5:
            rec = "Product onboarding / engagement campaign"
        elif c.complaints and c.complaints > 3:
            rec = "Priority customer support follow-up"
        elif c.contract_type == "Month-to-month" and c.discount_usage and c.discount_usage > 20:
            rec = "Targeted pricing incentive"
        elif c.tenure_months and c.tenure_months < 3 and a.engagement_score and a.engagement_score < 40:
            rec = "Activation campaign with guided onboarding"
        elif a.customer_value_score and a.customer_value_score > 80:
            rec = "Referral/loyalty program enrollment"
            
        reason = "Multiple factors"
        if a.top_churn_drivers and isinstance(a.top_churn_drivers, list) and len(a.top_churn_drivers) > 0:
            reason = a.top_churn_drivers[0].get("driver", "Multiple factors")
            
        recommendations.append({
            "customer_id": c.customer_id,
            "risk_level": a.risk_level,
            "revenue_at_risk": a.revenue_at_risk,
            "main_reason": reason,
            "recommended_action": rec,
            "priority": "High" if a.churn_probability > 0.7 else "Medium"
        })
        
        # Optionally update db
        a.recommended_action = rec
        a.priority = "High" if a.churn_probability > 0.7 else "Medium"
    
    db.commit()
    return recommendations

def simulate_retention(high_risk_count: int, retention_improvement_pct: float, db):
    customers_retained = high_risk_count * retention_improvement_pct
    
    # Calculate avg monthly charges of high risk
    res = db.query(CustomerAnalytics.revenue_at_risk).filter(CustomerAnalytics.risk_level.in_(['High', 'Critical'])).all()
    avg_rev = sum([r[0] for r in res]) / len(res) if res else 0
    
    monthly_revenue_protected = avg_rev * customers_retained
    annual_revenue_protected = monthly_revenue_protected * 12
    
    return {
        "high_risk_count": high_risk_count,
        "assumed_improvement_pct": retention_improvement_pct,
        "customers_retained": int(customers_retained),
        "monthly_revenue_protected": monthly_revenue_protected,
        "annual_revenue_protected": annual_revenue_protected
    }
