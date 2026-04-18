# rag_answers

from app.services.groq_client import GroqClient
from app.rag.generate import generate_answer
from app.rag.text_extraction import extract_text_from_pdf
from app.rag.chunking import chunk_document_by_page
from app.rag.embedding_store import embed_texts, upsert_chunks
from app.rag.retrieval import retrieve_documents    

from app.rag.memory_store import (
    store_memory,
    retrieve_memory
)

from collections import defaultdict


#Initialize LLM
groq = GroqClient()


#Short-term memory (in-memory)
chat_memory = defaultdict(list)
MAX_HISTORY = 5


# SHORT MEMORY
def get_short_memory(session_id):
    return chat_memory[session_id][-MAX_HISTORY:]


def add_short_memory(session_id, query, answer):
    chat_memory[session_id].append({
        "user": query,
        "assistant": answer
    })


# INGEST
def ingest_pdf(file_path: str, doc_id: str):
    pages = extract_text_from_pdf(file_path)
    chunks = chunk_document_by_page(pages, doc_id)

    print(f"Chunks created: {len(chunks)}")

    upsert_chunks(chunks)
    print("Uploaded to Pinecone")


# ASK
async def ask(query: str, session_id: str, doc_id: str):

    # 1. Retrieve documents
    doc_ctx = retrieve_documents(query, doc_id)

    # 2. Retrieve long-term memory
    mem_ctx = retrieve_memory(query, session_id)

    # 3. Short-term memory
    short_mem = get_short_memory(session_id)

    # 4. Generate Answer
    answer = await generate_answer(
        query=query,
        documents=doc_ctx,
        long_memory=mem_ctx,
        short_memory=short_mem
    )

    # 5. Store memory
    add_short_memory(session_id, query, answer)

    if len(query) > 20:
        store_memory(query, answer, session_id)

    return answer