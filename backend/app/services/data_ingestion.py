import pandas as pd
import io

def upload_csv(file_bytes: bytes, filename: str):
    df = pd.read_csv(io.BytesIO(file_bytes))
    return {
        "filename": filename,
        "row_count": len(df),
        "column_count": len(df.columns),
        "status": "success",
    }

def preview_data(df: pd.DataFrame):
    return df.head(20).to_dict(orient='records')

def validate_required_fields(df: pd.DataFrame, required_fields: list):
    missing = [f for f in required_fields if f not in df.columns]
    return missing

def detect_column_types(df: pd.DataFrame):
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    cat_cols = df.select_dtypes(exclude=['number']).columns.tolist()
    return {"numeric": num_cols, "categorical": cat_cols}

def generate_quality_warnings(df: pd.DataFrame):
    warnings = []
    missing_pct = df.isnull().mean() * 100
    for col, pct in missing_pct.items():
        if pct > 0:
            warnings.append(f"Column '{col}' has {pct:.1f}% missing values.")
    if df.duplicated().sum() > 0:
        warnings.append(f"Dataset has {df.duplicated().sum()} duplicate rows.")
    return warnings
