import hashlib
import re
from dataclasses import dataclass, field
from typing import Optional, List

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150

@dataclass
class Chunk:
    id: str
    text: str
    doc_id: str
    chunk_index: int
    char_count: int
    page_hint: Optional[int] = None
    extra: dict = field(default_factory=dict)

    def to_pinecone_record(self, vector: List[float]) -> dict:
        return {
            "id": self.id,
            "values": vector,
            "metadata": {
                "doc_id": self.doc_id,
                "chunk_index": self.chunk_index,
                "page_hint": self.page_hint,
                "text": self.text,
                "type": "document",
                "user_id": "default",
            },
        }

def clean_text(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()

def make_chunk_id(doc_id: str, index: int) -> str:
    raw = f"{doc_id}::{index}"
    return hashlib.sha256(raw.encode()).hexdigest()[:24]

def split_text(text: str):
    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks

def chunk_document_by_page(pages: List[str], doc_id: str) -> List[Chunk]:
    chunks = []
    global_idx = 0

    for page_num, page in enumerate(pages, start=1):
        if not page.strip():
            continue

        splits = split_text(page)

        for s in splits:
            cleaned = clean_text(s)
            if not cleaned:
                continue

            chunks.append(
                Chunk(
                    id=make_chunk_id(doc_id, global_idx),
                    text=cleaned,
                    doc_id=doc_id,
                    chunk_index=global_idx,
                    char_count=len(cleaned),
                    page_hint=page_num,
                )
            )
            global_idx += 1

    return chunks