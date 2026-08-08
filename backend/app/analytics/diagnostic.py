from sqlalchemy import func
from app.models.database import Customer, CustomerAnalytics

def get_churn_drivers(db):
    # Dummy mock for drivers
    return [
        {"driver": "Month-to-month contract", "correlation": 0.45},
        {"driver": "No tech support", "correlation": 0.35},
        {"driver": "High monthly charges", "correlation": 0.25}
    ]

def get_churn_by_dimension(db, dimension: str):
    # Just mock
    return {dimension: 0.2}
