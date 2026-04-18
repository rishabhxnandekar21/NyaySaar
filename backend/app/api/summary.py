from pydantic import BaseModel
from fastapi import APIRouter
from app.rag.generate import generate_summary
from app.rag.retrieval import retrieve_documents

router = APIRouter()

class SummaryRequest(BaseModel):
    doc_id: str

@router.post("/summary")
async def summarize(data: SummaryRequest):
    doc_id = data.doc_id

    #Retrieve document chunks
    docs = retrieve_documents("summarize this document", doc_id)

    if not docs:
        return {
            "summary": "No document content found.",
            "verdict": "Unable to determine verdict."
        }

    text = "\n".join(docs)

    #Generate summary
    result = await generate_summary(text)

    return {
        "summary": result.get("summary", ""),
        "verdict": result.get("verdict", "")
    }