from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import ModelPerformanceResponse
from app.models.database import ModelRun
from datetime import datetime

router = APIRouter()

@router.get("/performance", response_model=ModelPerformanceResponse)
def get_performance(db: Session = Depends(get_db)):
    run = db.query(ModelRun).filter(ModelRun.is_best == True).first()
    if not run:
        return ModelPerformanceResponse(
            model_type="None", accuracy=0.0, precision_score=0.0, recall=0.0, f1=0.0,
            roc_auc=0.0, pr_auc=0.0, is_best=False, trained_at=datetime.utcnow(),
            confusion_matrix=[], feature_importance={}
        )
    return run

@router.post("/train")
def train_model():
    return {"message": "Model training started"}
