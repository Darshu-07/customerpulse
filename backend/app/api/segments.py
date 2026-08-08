from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import SegmentListResponse, SegmentResponse
from app.models.database import CustomerAnalytics
from sqlalchemy import func

router = APIRouter()

@router.get("", response_model=SegmentListResponse)
def get_segments(db: Session = Depends(get_db)):
    # Group by segment
    res = db.query(
        CustomerAnalytics.segment_id,
        CustomerAnalytics.segment_name,
        func.count(CustomerAnalytics.id).label('count')
    ).group_by(CustomerAnalytics.segment_id, CustomerAnalytics.segment_name).all()
    
    segments = []
    for row in res:
        if row.segment_name:
            segments.append({
                "segment_id": row.segment_id or 0,
                "segment_name": row.segment_name,
                "customer_count": row.count,
                "avg_monthly_charges": 0.0,
                "avg_tenure": 0.0,
                "avg_churn_probability": 0.0,
                "key_features": {}
            })
    return {"segments": segments}

@router.get("/{segment_id}/customers")
def get_segment_customers(segment_id: int, db: Session = Depends(get_db)):
    return []

@router.post("/run")
def run_segmentation(db: Session = Depends(get_db)):
    return {"message": "Segmentation triggered"}
