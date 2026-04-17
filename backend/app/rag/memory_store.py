import uuid
from typing import List
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import os


# Model
model = SentenceTransformer("intfloat/multilingual-e5-base")

# Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

# Namespace
MEMORY_NAMESPACE = "chat-memory"

# STORE MEMORY
def store_memory(query: str, answer: str, session_id: str):
    try:
        memory_text = f"User: {query}\nAssistant: {answer}"

        vector = model.encode(memory_text).tolist()
        memory_id = str(uuid.uuid4())

        index.upsert(
            vectors=[
                {
                    "id": memory_id,
                    "values": vector,
                    "metadata": {
                        "type": "memory",
                        "text": memory_text,
                        "session_id": session_id
                    }
                }
            ],
            namespace=MEMORY_NAMESPACE
        )

    except Exception as e:
        print(f"[Memory Store Error]: {e}")


# RETRIEVE MEMORY
def retrieve_memory(query: str, session_id: str, top_k: int = 3) -> List[str]:
    try:
        query_vector = model.encode(query).tolist()

        results = index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
            namespace=MEMORY_NAMESPACE,
            filter={
                "type": "memory",
                "session_id": session_id 
            }
        )

        return [
            match.metadata["text"]
            for match in results.matches
        ]

    except Exception as e:
        print(f"[Memory Retrieve Error]: {e}")
        return []