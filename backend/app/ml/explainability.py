import os
import joblib
import numpy as np
from app.config import settings

def get_feature_importance():
    model_path = os.path.join(settings.MODELS_DIR, 'best_churn_model.pkl')
    features_path = os.path.join(settings.MODELS_DIR, 'feature_names.pkl')
    
    if os.path.exists(model_path) and os.path.exists(features_path):
        model = joblib.load(model_path)
        features = joblib.load(features_path)
        
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            res = sorted(zip(features, importances), key=lambda x: x[1], reverse=True)
            return {k: float(v) for k, v in res}
        elif hasattr(model, 'coef_'):
            importances = np.abs(model.coef_[0])
            res = sorted(zip(features, importances), key=lambda x: x[1], reverse=True)
            return {k: float(v) for k, v in res}
            
    return {"tenure_months": 0.2, "monthly_charges": 0.15, "engagement_score": 0.1}

def explain_customer(customer_data: dict):
    # Fallback explanation
    drivers = []
    if customer_data.get('product_usage_score', 100) < 40:
        drivers.append({"driver": "Low product usage score", "impact": 0.3, "detail": f"Score is {customer_data.get('product_usage_score')} vs avg 58"})
    if customer_data.get('support_tickets', 0) > 2:
        drivers.append({"driver": "High support tickets", "impact": 0.25, "detail": f"{customer_data.get('support_tickets')} tickets vs avg 0.8"})
    if customer_data.get('last_login_days', 0) > 15:
        drivers.append({"driver": "No recent login", "impact": 0.2, "detail": f"No login in {customer_data.get('last_login_days')} days"})
        
    if not drivers:
        drivers.append({"driver": "Base churn probability", "impact": 0.1, "detail": "Average risk"})
        
    return drivers[:5]
