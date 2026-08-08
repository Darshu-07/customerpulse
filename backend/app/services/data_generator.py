import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
from app.config import settings
import uuid

def load_or_generate_data():
    telco_path = os.path.join(settings.DATA_DIR, "telco_churn.csv")
    original_path = os.path.join(settings.DATA_DIR, "WA_Fn-UseC_-Telco-Customer-Churn.csv")
    if os.path.exists(telco_path):
        df = pd.read_csv(telco_path)
    elif os.path.exists(original_path):
        df = pd.read_csv(original_path)
    else:
        # Generate fully synthetic records if file doesn't exist
        np.random.seed(42)
        n = 10000
        df = pd.DataFrame({
            "customerID": [str(uuid.uuid4())[:8] for _ in range(n)],
            "gender": np.random.choice(["Male", "Female"], n),
            "SeniorCitizen": np.random.choice([0, 1], n, p=[0.8, 0.2]),
            "Partner": np.random.choice(["Yes", "No"], n),
            "Dependents": np.random.choice(["Yes", "No"], n),
            "tenure": np.random.randint(0, 73, n),
            "PhoneService": np.random.choice(["Yes", "No"], n),
            "MultipleLines": np.random.choice(["Yes", "No", "No phone service"], n),
            "InternetService": np.random.choice(["DSL", "Fiber optic", "No"], n),
            "OnlineSecurity": np.random.choice(["Yes", "No", "No internet service"], n),
            "OnlineBackup": np.random.choice(["Yes", "No", "No internet service"], n),
            "DeviceProtection": np.random.choice(["Yes", "No", "No internet service"], n),
            "TechSupport": np.random.choice(["Yes", "No", "No internet service"], n),
            "StreamingTV": np.random.choice(["Yes", "No", "No internet service"], n),
            "StreamingMovies": np.random.choice(["Yes", "No", "No internet service"], n),
            "Contract": np.random.choice(["Month-to-month", "One year", "Two year"], n),
            "PaperlessBilling": np.random.choice(["Yes", "No"], n),
            "PaymentMethod": np.random.choice(["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"], n),
            "MonthlyCharges": np.random.uniform(18.25, 118.75, n),
            "TotalCharges": np.random.uniform(18.25, 8684.8, n).astype(str),
            "Churn": np.random.choice(["Yes", "No"], n, p=[0.26, 0.74])
        })

    return enrich_data(df)

def enrich_data(df):
    np.random.seed(42)
    n = len(df)
    
    # Enrichment fields
    is_senior = df['SeniorCitizen'] == 1
    df['age'] = np.where(is_senior, np.random.randint(60, 85, n), np.random.randint(18, 59, n))
    
    cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"]
    df['city'] = np.random.choice(cities, n)
    df['country'] = "India"
    
    channels = ["Organic Search", "Paid Ads", "Referral", "Social Media", "Direct", "Partner"]
    df['acquisition_channel'] = np.random.choice(channels, n, p=[0.3, 0.2, 0.1, 0.2, 0.1, 0.1])
    
    # Mapping existing
    df['contract_type'] = df['Contract']
    df['tenure_months'] = df['tenure'].astype(int)
    
    today = datetime.now()
    df['signup_date'] = df['tenure_months'].apply(lambda t: (today - timedelta(days=t*30)).date())
    
    df['monthly_charges'] = df['MonthlyCharges']
    
    df['Churn_bool'] = df['Churn'].map({'Yes': True, 'No': False})
    
    # Behavior fields
    churned = df['Churn_bool']
    df['login_frequency'] = np.where(churned, np.random.uniform(0, 10, n), np.random.uniform(5, 30, n))
    df['average_session_minutes'] = np.where(churned, np.random.uniform(5, 20, n), np.random.uniform(15, 60, n))
    df['last_login_days'] = np.where(churned, np.random.randint(10, 90, n), np.random.randint(0, 30, n))
    
    df['product_usage_score'] = np.where(churned, np.random.uniform(0, 50, n), np.random.uniform(40, 100, n))
    df['features_used'] = (df['product_usage_score'] / 10).astype(int) + 1
    
    df['support_tickets'] = np.where(churned, np.random.randint(2, 15, n), np.random.randint(0, 5, n))
    df['complaints'] = np.where(churned, np.random.randint(1, 10, n), np.random.randint(0, 2, n))
    
    df['email_open_rate'] = np.where(churned, np.random.uniform(0, 0.3, n), np.random.uniform(0.2, 0.8, n))
    
    df['purchases'] = (df['tenure_months'] / 3).astype(int) + np.random.randint(0, 5, n)
    df['purchase_frequency'] = np.where(df['tenure_months'] > 0, df['purchases'] / df['tenure_months'], 0)
    df['average_order_value'] = df['monthly_charges'] * np.random.uniform(0.8, 1.2, n)
    
    df['discount_usage'] = np.where(df['contract_type'] == 'Month-to-month', np.random.uniform(10, 50, n), np.random.uniform(0, 20, n))
    df['refund_count'] = (df['complaints'] / 2).astype(int)
    
    df['satisfaction_score'] = np.where(churned, np.random.uniform(1, 3, n), np.random.uniform(3, 5, n))
    df['nps_score'] = (df['satisfaction_score'] * 20 - 20).astype(int)
    
    df['auto_renew'] = np.where(df['contract_type'] != 'Month-to-month', True, False)
    
    def random_date_in_last_3_months():
        days_ago = np.random.randint(1, 90)
        return (today - timedelta(days=days_ago)).date()
        
    df['churn_date'] = df['Churn_bool'].apply(lambda x: random_date_in_last_3_months() if x else None)
    
    reasons = ["Price too high", "Poor service", "Competitor offer", "Not using product", "Technical issues"]
    df['churn_reason'] = df['Churn_bool'].apply(lambda x: np.random.choice(reasons) if x else None)

    # Rename original cols to schema where needed
    rename_map = {
        'customerID': 'customer_id',
        'gender': 'gender',
        'PaymentMethod': 'payment_method',
        'PhoneService': 'phone_service',
        'MultipleLines': 'multiple_lines',
        'InternetService': 'internet_service',
        'OnlineSecurity': 'online_security',
        'OnlineBackup': 'online_backup',
        'DeviceProtection': 'device_protection',
        'TechSupport': 'tech_support',
        'StreamingTV': 'streaming_tv',
        'StreamingMovies': 'streaming_movies'
    }
    df.rename(columns=rename_map, inplace=True)
    
    # Handle TotalCharges whitespace
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].replace(" ", ""), errors='coerce').fillna(0)
    df['total_charges'] = df['TotalCharges']
    
    df['paperless_billing'] = df['PaperlessBilling'] == 'Yes'
    df['senior_citizen'] = df['SeniorCitizen'] == 1
    df['partner'] = df['Partner'] == 'Yes'
    df['dependents'] = df['Dependents'] == 'Yes'
    df['phone_service'] = df['phone_service'] == 'Yes'
    df['churn'] = df['Churn_bool']
    
    return df
