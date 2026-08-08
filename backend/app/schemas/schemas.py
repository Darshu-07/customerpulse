from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import date, datetime

class CustomerBase(BaseModel):
    customer_id: str
    age: Optional[int]
    gender: Optional[str]
    city: Optional[str]
    country: Optional[str]
    acquisition_channel: Optional[str]
    signup_date: Optional[date]
    tenure_months: Optional[int]
    subscription_type: Optional[str]
    contract_type: Optional[str]
    monthly_charges: Optional[float]
    total_charges: Optional[float]
    payment_method: Optional[str]
    auto_renew: Optional[bool]
    phone_service: Optional[bool]
    multiple_lines: Optional[str]
    internet_service: Optional[str]
    online_security: Optional[str]
    online_backup: Optional[str]
    device_protection: Optional[str]
    tech_support: Optional[str]
    streaming_tv: Optional[str]
    streaming_movies: Optional[str]
    paperless_billing: Optional[bool]
    senior_citizen: Optional[bool]
    partner: Optional[bool]
    dependents: Optional[bool]
    login_frequency: Optional[float]
    average_session_minutes: Optional[float]
    last_login_days: Optional[int]
    product_usage_score: Optional[float]
    features_used: Optional[int]
    support_tickets: Optional[int]
    complaints: Optional[int]
    email_open_rate: Optional[float]
    purchases: Optional[int]
    purchase_frequency: Optional[float]
    average_order_value: Optional[float]
    discount_usage: Optional[float]
    refund_count: Optional[int]
    satisfaction_score: Optional[float]
    nps_score: Optional[int]
    churn: Optional[bool]
    churn_date: Optional[date]
    churn_reason: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class CustomerAnalyticsBase(BaseModel):
    engagement_score: Optional[float]
    customer_value_score: Optional[float]
    support_friction_score: Optional[float]
    recency: Optional[float]
    frequency: Optional[float]
    monetary: Optional[float]
    rfm_segment: Optional[str]
    churn_probability: Optional[float]
    risk_level: Optional[str]
    predicted_clv: Optional[float]
    revenue_at_risk: Optional[float]
    segment_id: Optional[int]
    segment_name: Optional[str]
    top_churn_drivers: Optional[Any]
    recommended_action: Optional[str]
    priority: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class CustomerResponse(CustomerBase):
    id: int

class CustomerDetail(CustomerResponse):
    analytics: Optional[CustomerAnalyticsBase]

class CustomerListResponse(BaseModel):
    items: List[CustomerDetail]
    total: int
    page: int
    per_page: int

class DashboardSummary(BaseModel):
    total_customers: int
    active_customers: int
    churned_customers: int
    churn_rate: float
    high_risk_customers: int
    critical_risk_count: int
    revenue_at_risk: float
    average_clv: float
    average_satisfaction: float
    health_distribution: List[Dict[str, Any]]
    segment_performance: List[Dict[str, Any]]
    revenue_at_risk_by_segment: List[Dict[str, Any]]
    top_churn_drivers: List[Dict[str, Any]]
    priority_customers: List[Dict[str, Any]]

class SegmentResponse(BaseModel):
    segment_id: int
    segment_name: str
    customer_count: int
    avg_monthly_charges: float
    avg_tenure: float
    avg_churn_probability: float
    key_features: Dict[str, Any]

class SegmentListResponse(BaseModel):
    segments: List[SegmentResponse]

class ChurnSummary(BaseModel):
    overall_churn_rate: float
    risk_distribution: Dict[str, int]
    by_contract: Dict[str, float]
    by_internet_service: Dict[str, float]
    top_drivers: List[Dict[str, Any]]

class HighRiskCustomer(BaseModel):
    customer_id: str
    risk_level: str
    churn_probability: float
    revenue_at_risk: float
    top_drivers: List[Dict[str, Any]]

class RevenueAtRisk(BaseModel):
    total_revenue_at_risk: float
    by_segment: Dict[str, float]
    by_contract: Dict[str, float]
    top_customers: List[Dict[str, Any]]

class RetentionRecommendation(BaseModel):
    customer_id: str
    risk_level: str
    revenue_at_risk: float
    main_reason: str
    recommended_action: str
    priority: str

class RetentionSimulation(BaseModel):
    high_risk_count: int
    assumed_improvement_pct: float
    customers_retained: int
    monthly_revenue_protected: float
    annual_revenue_protected: float

class ModelPerformanceResponse(BaseModel):
    model_type: str
    accuracy: float
    precision_score: float
    recall: float
    f1: float
    roc_auc: float
    pr_auc: float
    is_best: bool
    trained_at: datetime
    confusion_matrix: Any
    feature_importance: Any

class AIQueryRequest(BaseModel):
    question: str

class AIQueryResponse(BaseModel):
    answer: str
    data: Optional[Any] = None

class DataUploadResponse(BaseModel):
    filename: str
    status: str
    row_count: int
    column_count: int

class DataQualityReport(BaseModel):
    total_rows: int
    duplicates: int
    missing_cells: int
    missing_pct: float
    numeric_cols: List[str]
    categorical_cols: List[str]
    outlier_cols: Dict[str, int]
