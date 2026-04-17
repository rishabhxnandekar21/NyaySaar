import os
from dotenv import load_dotenv

load_dotenv()

print("API KEY:", os.getenv("PINECONE_API_KEY")) 

from app.rag.embedding_store import embed_text
from pinecone import Pinecone

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("nyay-saar")

# 🔹 Store data
text = "Contract law deals with agreements between parties."
vector = embed_text(text)

index.upsert([
    {
        "id": "test1",
        "values": vector,
        "metadata": {"text": text}
    }
])

print("✅ Data inserted")

# 🔹 Query
query = "What is contract law?"
query_vector = embed_text(query, is_query=True)

results = index.query(
    vector=query_vector,
    top_k=1,
    include_metadata=True
)

print("\n🔍 Query Result:")
print(results)