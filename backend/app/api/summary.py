from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.generate import generate_summary

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str

@router.post("/summary")
async def summarize(req: SummaryRequest):
    result = await generate_summary(req.text)   # ✅ FIX
    return {"summary": result}