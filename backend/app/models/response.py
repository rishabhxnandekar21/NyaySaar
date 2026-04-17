from pydantic import BaseModel
from typing import Optional, List


class QueryResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []
    metadata: Optional[dict] = {}