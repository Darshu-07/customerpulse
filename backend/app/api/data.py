from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import DataUploadResponse, DataQualityReport
from app.services.data_ingestion import upload_csv
from app.services.data_pipeline import run_full_pipeline
from app.config import settings
import pandas as pd
import io
import os

router = APIRouter()

@router.post("/upload", response_model=DataUploadResponse)
async def upload_data(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    content = await file.read()
    # Save the uploaded CSV into the data directory (overwrites existing telco_churn.csv)
    upload_path = os.path.join(settings.DATA_DIR, "telco_churn.csv")
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    with open(upload_path, "wb") as f:
        f.write(content)
    # Trigger the full data pipeline in the background
    background_tasks.add_task(run_full_pipeline, upload_path)
    return DataUploadResponse(
        filename=file.filename,
        status="processing_started",
        row_count=len(pd.read_csv(io.BytesIO(content))),
        column_count=len(pd.read_csv(io.BytesIO(content)).columns)
    )

@router.get("/quality-report", response_model=DataQualityReport)
def quality_report():
    # Placeholder – a real implementation would inspect the current dataframe in the DB
    return DataQualityReport(
        total_rows=0,
        duplicates=0,
        missing_cells=0,
        missing_pct=0.0,
        numeric_cols=[],
        categorical_cols=[],
        outlier_cols={}
    )

@router.get("/status")
def data_status(db: Session = Depends(get_db)):
    """Check if data has been loaded and pipeline has run."""
    from app.models.database import Customer
    count = db.query(Customer).count()
    if count > 0:
        return {"status": "ready", "customer_count": count}
    else:
        return {"status": "no_data", "customer_count": 0}

@router.get("/sample-download")
def download_sample():
    sample_path = "sample.csv"
    pd.DataFrame({"customer_id": ["123"], "churn": [False]}).to_csv(sample_path, index=False)
    return FileResponse(sample_path, filename="sample.csv")
