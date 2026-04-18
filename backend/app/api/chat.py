from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.generate import generate_answer
from app.rag.retrieval import retrieve_documents

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    persona: str
    doc_id: str

@router.post("/chat")
async def chat(data: ChatRequest):
    query = data.question
    doc_id = data.doc_id

    #retrieve relevant chunks
    docs = retrieve_documents(query, doc_id)

    if not docs:
        return {"answer": "No relevant context found in document."}

    answer = await generate_answer(
        query=query,
        documents=docs,
        long_memory=[],
        short_memory=[]
    )

    return {
        "answer": answer
    }