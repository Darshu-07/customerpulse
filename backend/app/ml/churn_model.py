import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, average_precision_score, confusion_matrix
import joblib
import os
from app.config import settings

def train_churn_models(df: pd.DataFrame):
    df_model = df.copy()
    
    # Drop non-predictive
    drop_cols = ['customer_id', 'churn_date', 'churn_reason']
    for c in drop_cols:
        if c in df_model.columns:
            df_model = df_model.drop(columns=[c])
            
    if 'churn' not in df_model.columns:
        df_model['churn'] = False # default fallback if not found
        
    y = df_model['churn'].astype(int)
    X = df_model.drop(columns=['churn'])
    
    # Categoricals
    cat_cols = X.select_dtypes(include=['object', 'category']).columns
    for c in cat_cols:
        le = LabelEncoder()
        X[c] = X[c].astype(str)
        X[c] = le.fit_transform(X[c])
        
    scaler = StandardScaler()
    X_cols = X.columns
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, stratify=y, random_state=42)
    
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42),
        'RandomForest': RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42),
        'GradientBoosting': GradientBoostingClassifier(random_state=42)
    }
    
    results = {}
    best_score = 0
    best_model_name = ""
    best_model = None
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        if hasattr(model, 'predict_proba'):
            y_prob = model.predict_proba(X_test)[:, 1]
        else:
            y_prob = y_pred
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_prob)
        pr_auc = average_precision_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        score = f1 * 0.4 + roc_auc * 0.4 + rec * 0.2
        
        results[name] = {
            'accuracy': float(acc),
            'precision': float(prec),
            'recall': float(rec),
            'f1': float(f1),
            'roc_auc': float(roc_auc),
            'pr_auc': float(pr_auc),
            'confusion_matrix': cm
        }
        
        if score > best_score:
            best_score = score
            best_model_name = name
            best_model = model
            
    os.makedirs(settings.MODELS_DIR, exist_ok=True)
    joblib.dump(best_model, os.path.join(settings.MODELS_DIR, 'best_churn_model.pkl'))
    joblib.dump(scaler, os.path.join(settings.MODELS_DIR, 'scaler.pkl'))
    joblib.dump(list(X_cols), os.path.join(settings.MODELS_DIR, 'feature_names.pkl'))
    
    return results, best_model_name

def predict_churn(df: pd.DataFrame):
    model_path = os.path.join(settings.MODELS_DIR, 'best_churn_model.pkl')
    scaler_path = os.path.join(settings.MODELS_DIR, 'scaler.pkl')
    features_path = os.path.join(settings.MODELS_DIR, 'feature_names.pkl')
    
    if not (os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(features_path)):
        # Return dummies
        return pd.DataFrame({
            'customer_id': df.get('customer_id', []),
            'churn_probability': [0.1] * len(df),
            'risk_level': ['Low'] * len(df)
        })
        
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    features = joblib.load(features_path)
    
    df_copy = df.copy()
    customer_ids = df_copy.get('customer_id', pd.Series(range(len(df_copy))))
    
    for f in features:
        if f not in df_copy.columns:
            df_copy[f] = 0
            
    X = df_copy[features]
    
    # Categoricals
    cat_cols = X.select_dtypes(include=['object', 'category']).columns
    for c in cat_cols:
        X[c] = X[c].astype(str).astype('category').cat.codes
        
    X_scaled = scaler.transform(X)
    
    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(X_scaled)[:, 1]
    else:
        probs = model.predict(X_scaled)
        
    def get_risk(p):
        if p < 0.3: return 'Low'
        if p < 0.6: return 'Medium'
        if p < 0.8: return 'High'
        return 'Critical'
        
    res = pd.DataFrame({
        'customer_id': customer_ids,
        'churn_probability': probs,
        'risk_level': [get_risk(p) for p in probs]
    })
    
    return res
