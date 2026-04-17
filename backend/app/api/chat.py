from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.rag_pipeline import ask

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: str


@router.post("/chat")
async def chat(req: ChatRequest):
    response = await ask(   # ✅ USE PIPELINE
        query=req.query,
        session_id=req.session_id
    )

    return {
        "query": req.query,
        "response": response
    }