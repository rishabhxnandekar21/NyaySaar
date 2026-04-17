from pydantic import BaseModel
from typing import Optional, List


class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    chat_history: Optional[List[str]] = []