from app.analytics import descriptive, diagnostic, revenue_risk
import httpx
from app.config import settings

async def ask_question(question: str, db):
    q_lower = question.lower()
    
    if "churn rate" in q_lower:
        summary = descriptive.get_churn_rates(db)
        return {"answer": f"The overall churn rate is {summary.get('overall_churn_rate', 0):.2%}.", "data": summary}
    elif "high risk" in q_lower or "at risk" in q_lower:
        return {"answer": "Here are the high risk customers:", "data": {"type": "high_risk_list"}}
    elif "revenue risk" in q_lower:
        rr = revenue_risk.calculate_revenue_at_risk(db)
        return {"answer": f"Total revenue at risk is ${rr.get('total_revenue_at_risk', 0):.2f}.", "data": rr}
    elif "churn drivers" in q_lower or "why" in q_lower:
        drivers = diagnostic.get_churn_drivers(db)
        return {"answer": "Here are the top churn drivers.", "data": drivers}
    
    # Fallback to LLM if configured
    if settings.AI_PROVIDER != "none" and settings.OPENAI_API_KEY:
        # Example pseudo-LLM call
        return {"answer": f"LLM parsed query: {question}. Not fully implemented.", "data": None}
        
    return {"answer": "I can help you with churn rates, high risk customers, revenue at risk, and churn drivers. Please ask about one of those.", "data": None}
