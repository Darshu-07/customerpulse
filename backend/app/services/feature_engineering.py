import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def compute_engagement_score(df: pd.DataFrame):
    scaler = MinMaxScaler(feature_range=(0, 100))
    # Combining login_frequency, avg_session_minutes, product_usage_score, email_open_rate
    features = ['login_frequency', 'average_session_minutes', 'product_usage_score', 'email_open_rate']
    temp = df[features].fillna(0)
    scores = scaler.fit_transform(temp).mean(axis=1)
    return scores

def compute_customer_value_score(df: pd.DataFrame):
    scaler = MinMaxScaler(feature_range=(0, 100))
    features = ['total_charges', 'purchase_frequency', 'average_order_value', 'tenure_months']
    temp = df[features].fillna(0)
    scores = scaler.fit_transform(temp).mean(axis=1)
    return scores

def compute_support_friction_score(df: pd.DataFrame):
    scaler = MinMaxScaler(feature_range=(0, 100))
    features = ['support_tickets', 'complaints', 'refund_count']
    temp = df[features].fillna(0)
    scores = scaler.fit_transform(temp).mean(axis=1)
    return scores

def compute_rfm(df: pd.DataFrame):
    recency = df['last_login_days']
    frequency = df['purchase_frequency']
    monetary = df['monthly_charges'] * df['tenure_months']
    
    # Example simple RFM score logic
    r_score = pd.qcut(recency, 4, labels=[4, 3, 2, 1], duplicates='drop').astype(str)
    f_score = pd.qcut(frequency.rank(method='first'), 4, labels=[1, 2, 3, 4]).astype(str)
    m_score = pd.qcut(monetary.rank(method='first'), 4, labels=[1, 2, 3, 4]).astype(str)
    
    rfm_segment = r_score + f_score + m_score
    return recency, frequency, monetary, rfm_segment

def compute_all_features(df: pd.DataFrame):
    df = df.copy()
    df['engagement_score'] = compute_engagement_score(df)
    df['customer_value_score'] = compute_customer_value_score(df)
    df['support_friction_score'] = compute_support_friction_score(df)
    r, f, m, rfm = compute_rfm(df)
    df['recency'] = r
    df['frequency'] = f
    df['monetary'] = m
    df['rfm_segment'] = rfm
    return df
