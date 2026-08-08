from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.schemas import RetentionRecommendation, RetentionSimulation
from app.services.retention_engine import generate_recommendations, simulate_retention
from pydantic import BaseModel

router = APIRouter()

@router.get("/recommendations", response_model=List[RetentionRecommendation])
def get_recommendations(priority: str = "", limit: int = 50, db: Session = Depends(get_db)):
    recs = generate_recommendations(db)
    if priority:
        recs = [r for r in recs if r['priority'] == priority]
    return recs[:limit]

class SimulateRequest(BaseModel):
    high_risk_count: int
    retention_improvement_pct: float

@router.post("/simulate", response_model=RetentionSimulation)
def simulate(req: SimulateRequest, db: Session = Depends(get_db)):
    return simulate_retention(req.high_risk_count, req.retention_improvement_pct, db)
