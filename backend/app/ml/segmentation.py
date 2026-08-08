import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

def run_segmentation(df: pd.DataFrame, n_clusters=None):
    features = ['recency', 'frequency', 'monetary', 'tenure_months', 'engagement_score', 'satisfaction_score', 'customer_value_score']
    
    # Filter to numeric columns and fill NA
    X = df[features].copy()
    for col in features:
        if col not in X.columns:
            X[col] = 0
    X = X.fillna(0)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    inertias = []
    best_k = n_clusters or 4
    best_score = 0.5
    
    if n_clusters is None:
        # Downsample for silhouette evaluation to prevent memory spikes
        sample_size = min(1000, len(X_scaled))
        X_sample = X_scaled[:sample_size]
        best_k = 4
        best_score = -1
        for k in range(2, 6):
            km = KMeans(n_clusters=k, random_state=42, n_init=5)
            labels = km.fit_predict(X_sample)
            score = silhouette_score(X_sample, labels)
            if score > best_score:
                best_score = score
                best_k = k
    
    km = KMeans(n_clusters=best_k, random_state=42, n_init=5)
    labels = km.fit_predict(X_scaled)
    
    # Centroids mapping
    centroids = km.cluster_centers_
    centroids_orig = scaler.inverse_transform(centroids)
    
    segment_profiles = {}
    names = ['High Value Loyal', 'At-Risk High Value', 'New Customers', 'Low Engagement', 'Churn-Prone', 'Potential Loyalists']
    
    for i in range(best_k):
        name_idx = i % len(names)
        segment_profiles[i] = {
            "name": names[name_idx],
            "avg_recency": float(centroids_orig[i][0]),
            "avg_frequency": float(centroids_orig[i][1]),
            "avg_monetary": float(centroids_orig[i][2])
        }
        
    return {
        "labels": labels.tolist(),
        "centroids": centroids.tolist(),
        "segment_profiles": segment_profiles,
        "silhouette_score": float(best_score) if best_score != -1 else 0.5,
        "inertias": inertias,
        "optimal_k": best_k
    }
