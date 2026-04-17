#embedding store

import os
from typing import List
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from .chunking import Chunk

# Load embedding model (runs locally)
model = SentenceTransformer("intfloat/multilingual-e5-base")

def get_index():
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    return pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def embed_text(text: str, is_query: bool = False):
    prefix = "query: " if is_query else "passage: "
    formatted_text = prefix + text

    embedding = model.encode([formatted_text])[0]
    return embedding.tolist()

def embed_texts(texts: List[str]) -> List[List[float]]:
    formatted = ["passage: " + t for t in texts]
    return model.encode(formatted).tolist()
def upsert_chunks(chunks: List[Chunk]):
    texts = [c.text for c in chunks]

    print("Generating embeddings...")
    vectors = embed_texts(texts)

    records = [
        chunk.to_pinecone_record(vec)
        for chunk, vec in zip(chunks, vectors)
    ]

    print("Uploading to Pinecone...")
    batch_size = 100
    
    index = get_index()

    for i in range(0, len(records), batch_size):
        index.upsert(records[i:i + batch_size])

    print("Done storing embeddings!")