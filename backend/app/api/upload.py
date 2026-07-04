from sqlalchemy.orm import Session

from app.auth.auth_guard import get_current_user
from app.config.database import get_database_session
from app.models.user import User
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid

from app.rag.text_extraction import extract_text_from_pdf
from app.rag.chunking import chunk_document_by_page
from app.rag.embedding_store import upsert_chunks

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    db_session: Session = Depends(get_database_session),
    current_user: User = Depends(get_current_user),
):
    print(current_user.email)
    
    #Validate file
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    #Unique document ID
    doc_id = str(uuid.uuid4())

    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")

    #Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    #Extract text
    text = extract_text_from_pdf(file_path)

    #Chunking
    chunks = chunk_document_by_page(text, doc_id)

    #Store embeddings
    upsert_chunks(chunks)

    return {
        "message": "File uploaded and processed successfully",
        "doc_id": doc_id
    }
