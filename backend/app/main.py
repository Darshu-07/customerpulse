import os
import glob
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import init_db, SessionLocal
from app.api import dashboard, data, customers, segments, churn, revenue, retention, model, ai
from app.services.data_pipeline import run_full_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CustomerPulse Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(data.router, prefix="/api/data", tags=["Data"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(segments.router, prefix="/api/segments", tags=["Segments"])
app.include_router(churn.router, prefix="/api/churn", tags=["Churn"])
app.include_router(revenue.router, prefix="/api/revenue", tags=["Revenue"])
app.include_router(retention.router, prefix="/api/retention", tags=["Retention"])
app.include_router(model.router, prefix="/api/model", tags=["Model"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.on_event("startup")
def on_startup():
    logger.info("Starting up CustomerPulse backend")
    init_db()
    
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    os.makedirs(settings.MODELS_DIR, exist_ok=True)
    
    # Check if data already exists in the database
    from app.models.database import Customer
    db = SessionLocal()
    try:
        existing_count = db.query(Customer).count()
    finally:
        db.close()
    
    if existing_count > 0:
        logger.info("Database already has %d customers — skipping pipeline.", existing_count)
        return
    
    # Auto-detect any CSV file in the data directory
    csv_files = glob.glob(os.path.join(settings.DATA_DIR, "*.csv"))
    if csv_files:
        data_path = csv_files[0]  # Use the first CSV found
        logger.info("Found dataset: %s — running full pipeline.", data_path)
        run_full_pipeline(data_path)
    else:
        logger.info("No CSV found in %s; awaiting user upload.", settings.DATA_DIR)
