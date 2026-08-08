import pandas as pd
import numpy as np

def clean_data(df: pd.DataFrame):
    # TotalCharges issue already handled in generator/ingestion normally, but let's be sure
    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).replace(" ", ""), errors='coerce').fillna(0)
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing
    num_cols = df.select_dtypes(include=['number']).columns
    cat_cols = df.select_dtypes(exclude=['number']).columns
    
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())
        
    for col in cat_cols:
        if not df[col].mode().empty:
            df[col] = df[col].fillna(df[col].mode()[0])
            
    # Cap outliers (IQR)
    for col in num_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df[col] = np.where(df[col] > upper_bound, upper_bound, df[col])
        df[col] = np.where(df[col] < lower_bound, lower_bound, df[col])
        
    report = get_quality_report(df)
    return df, report

def get_quality_report(df: pd.DataFrame):
    total_rows = len(df)
    duplicates = df.duplicated().sum()
    missing_cells = df.isnull().sum().sum()
    missing_pct = (missing_cells / (total_rows * len(df.columns))) * 100
    
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    cat_cols = df.select_dtypes(exclude=['number']).columns.tolist()
    
    return {
        "total_rows": total_rows,
        "duplicates": int(duplicates),
        "missing_cells": int(missing_cells),
        "missing_pct": float(missing_pct),
        "numeric_cols": num_cols,
        "categorical_cols": cat_cols,
        "outlier_cols": {} # Simplified
    }
