export interface Customer {
  id: string;
  segment: string;
  monthly_charges: number;
  total_charges: number;
  tenure: number;
  engagement_score: number;
  satisfaction_score: number;
  churn_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  revenue_at_risk: number;
  age?: number;
  gender?: string;
  location?: string;
  signup_date?: string;
  subscription_type?: string;
  contract_type?: string;
  payment_method?: string;
  login_frequency?: number;
  last_login_days_ago?: number;
  avg_session_minutes?: number;
  product_usage_score?: number;
  features_used?: string[];
  email_open_rate?: number;
  nps_score?: number;
  complaints?: number;
  support_tickets?: number;
  refund_count?: number;
  top_churn_drivers?: { reason: string; impact: number }[];
  recommended_action?: string;
}

export interface DashboardSummary {
  total_customers: number;
  churn_rate: number;
  revenue_at_risk: number;
  high_risk_customers: number;
  average_clv: number;
  average_satisfaction: number;
  health_distribution: { name: string; value: number }[];
  top_churn_drivers: { name: string; value: number }[];
  segment_performance: {
    segment: string;
    customers: number;
    revenue: number;
    churn_rate: number;
    avg_clv: number;
  }[];
  revenue_at_risk_by_segment: { segment: string; value: number }[];
  priority_customers: Customer[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
