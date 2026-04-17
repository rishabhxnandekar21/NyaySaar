# app/rag/retrieval.py

from sentence_transformers import SentenceTransformer
from app.rag.embedding_store import embed_text, get_index


DOC_NAMESPACE = "documents"


def retrieve_documents(query: str, top_k: int = 5):
    try:
        query_vector = embed_text(query, is_query=True)
        
        index = get_index()

        results = index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
            namespace=DOC_NAMESPACE
        )

        documents = []
        for match in results.matches:
            text = match.metadata.get("text")
            if text:
                documents.append(text)

        return documents

    except Exception as e:
        print(f"[Retrieval Error]: {e}")
        return []