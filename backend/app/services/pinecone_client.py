import os
from pinecone import Pinecone

class PineconeClient:
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index = self.pc.Index(os.getenv("PINECONE_INDEX_NAME"))

    # UPSERT
    def upsert(self, records: list, batch_size: int = 100):
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            self.index.upsert(batch)

    # QUERY
    def query(self, vector, top_k=5, filter=None):
        return self.index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=True,
            filter=filter
        )