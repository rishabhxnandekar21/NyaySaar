"""Text extraction module for PDF documents using PyMuPDF (fitz).
This module provides functions to load PDF documents, 
extract text page by page and clean the text.
"""


import fitz  # PyMuPDF
import requests
import tempfile
from typing import List, Dict, Any
from app.utils.logger import get_logger

logger = get_logger(__name__)

def load_pdf(pdf_path: str) -> fitz.Document:
    """Load a PDF document from a local path or URL."""
    if pdf_path.startwith("http"):
        response = requests.get(pdf_path, timeout=10)
        response.raise_for_status()

        temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp.write(response.content)
        temp.close()

        return fitz.open(temp.name)
    
    return fitz.open(pdf_path)

def clean_text(text: str) -> str:
    text = text.replace("\r", "\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
    """Split text into chunks of a specified size with optional overlap."""
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size - overlap):
        chunk = words[i:i + chunk_size]
        chunks.append(" ".join(chunk))

    return chunks

def extract_text_with_citations(
        pdf_path: str,
        chunk_size: int = 500,
        overlap: int = 100
) -> list[str, Any]:
    
    try:
        doc = load_pdf(pdf_path)
        all_chunks = []
        full_text_parts = []

        for page_index, page in enumerate(doc):
            page_number = page_index + 1

            try:
                text = clean_text(page.get_text())

                if not text:
                    continue

                full_text_parts.append(text)

                chunks = chunk_text(text, chunk_size, overlap)

                for chunk_index, chunk in enumerate(chunks):
                    chunk_id = f"p{page_number}_c{chunk_index}"

                    all_chunks.append({
                        "chunk_id": chunk_id,
                        "text": chunk,

                        # Metadata for traceability
                        "page_number": page_number,
                        "chunk_index": chunk_index,
                        "source": pdf_path,
                        "char_count": len(chunk),
                        "word_count": len(chunk.split())
                    })

            except Exception as e:
                logger.warning(f"Page {page_number} Failed to extract text: {str(e)}")

            doc.close()

            full_text = "\n\n".join(full_text_parts)
            return{
                "text": full_text,
                "chunks": all_chunks,
                "total_chunks": len(all_chunks),
                "page_count": len(doc),
                "success": True,
                "error": None
            }
        
    except Exception as e:
        logger.error(f"Extraction failed: {str(e)}", exc_info=True)
        return{
            "text": None,
            "chunks": [],
            "total_chunks": 0,
            "page_count": 0,
            "success": False,
            "error": str(e)
        }
    