import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Check indexes
print("Indexes:", pc.list_indexes().names())

# Connect to your index
index = pc.Index("nyay-saar")

# Check stats
stats = index.describe_index_stats()
print("Stats:", stats)