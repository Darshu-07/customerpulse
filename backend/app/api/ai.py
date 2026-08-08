from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import AIQueryRequest, AIQueryResponse
from app.services.ai_assistant import ask_question

router = APIRouter()

@router.post("/query", response_model=AIQueryResponse)
async def query_ai(req: AIQueryRequest, db: Session = Depends(get_db)):
    return await ask_question(req.question, db)
