from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.generate import generate_summary
router = APIRouter()

class SummaryRequest(BaseModel):
    text: str

@router.post("/summary")
async def summarize(data: dict):
    text = data.get("text", "")
    result = generate_summary(text)
    return {"summary": result}