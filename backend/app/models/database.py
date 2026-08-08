from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String, unique=True, index=True)
    age = Column(Integer)
    gender = Column(String)
    city = Column(String)
    country = Column(String)
    acquisition_channel = Column(String)
    signup_date = Column(Date)
    tenure_months = Column(Integer)
    subscription_type = Column(String)
    contract_type = Column(String)
    monthly_charges = Column(Float)
    total_charges = Column(Float)
    payment_method = Column(String)
    auto_renew = Column(Boolean)
    phone_service = Column(Boolean)
    multiple_lines = Column(String)
    internet_service = Column(String)
    online_security = Column(String)
    online_backup = Column(String)
    device_protection = Column(String)
    tech_support = Column(String)
    streaming_tv = Column(String)
    streaming_movies = Column(String)
    paperless_billing = Column(Boolean)
    senior_citizen = Column(Boolean)
    partner = Column(Boolean)
    dependents = Column(Boolean)
    login_frequency = Column(Float)
    average_session_minutes = Column(Float)
    last_login_days = Column(Integer)
    product_usage_score = Column(Float)
    features_used = Column(Integer)
    support_tickets = Column(Integer)
    complaints = Column(Integer)
    email_open_rate = Column(Float)
    purchases = Column(Integer)
    purchase_frequency = Column(Float)
    average_order_value = Column(Float)
    discount_usage = Column(Float)
    refund_count = Column(Integer)
    satisfaction_score = Column(Float)
    nps_score = Column(Integer)
    churn = Column(Boolean)
    churn_date = Column(Date, nullable=True)
    churn_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    analytics = relationship("CustomerAnalytics", back_populates="customer", uselist=False)

class CustomerAnalytics(Base):
    __tablename__ = "customer_analytics"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    engagement_score = Column(Float)
    customer_value_score = Column(Float)
    support_friction_score = Column(Float)
    recency = Column(Float)
    frequency = Column(Float)
    monetary = Column(Float)
    rfm_segment = Column(String)
    churn_probability = Column(Float)
    risk_level = Column(String)
    predicted_clv = Column(Float)
    revenue_at_risk = Column(Float)
    segment_id = Column(Integer, nullable=True)
    segment_name = Column(String, nullable=True)
    top_churn_drivers = Column(JSON)
    recommended_action = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    computed_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="analytics")

class ModelRun(Base):
    __tablename__ = "model_runs"

    id = Column(Integer, primary_key=True)
    model_type = Column(String)
    accuracy = Column(Float)
    precision_score = Column(Float)
    recall = Column(Float)
    f1 = Column(Float)
    roc_auc = Column(Float)
    pr_auc = Column(Float)
    confusion_matrix = Column(JSON)
    feature_importance = Column(JSON)
    is_best = Column(Boolean)
    trained_at = Column(DateTime, default=datetime.utcnow)
    parameters = Column(JSON)

class DataUpload(Base):
    __tablename__ = "data_uploads"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    row_count = Column(Integer)
    column_count = Column(Integer)
    status = Column(String)
    quality_report = Column(JSON)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
