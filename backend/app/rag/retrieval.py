# app/rag/retrieval.py

from sentence_transformers import SentenceTransformer
from app.rag.embedding_store import embed_text, get_index


DOC_NAMESPACE = "documents"


def retrieve_documents(query, doc_id):
    query_embedding = embed_text(query)

    index = get_index()

    results = index.query(
        vector=query_embedding,
        top_k=5,
        include_metadata=True,
        filter={"doc_id": doc_id}
    )

    print("RAW MATCHES:", results)   # debug

    docs = []

    for match in results["matches"]:
        if "metadata" in match and "text" in match["metadata"]:
            docs.append(match["metadata"]["text"])

    print("FINAL DOCS:", docs)   # debug

    return docs