"""Text extraction module for PDF documents using PyMuPDF (fitz).
This module provides functions to load PDF documents, 
extract text page by page and clean the text.
"""
#pdf to text

import fitz  # PyMuPDF
from typing import List

def extract_text_from_pdf(path: str) -> List[str]:
    doc = fitz.open(path)
    return [page.get_text() for page in doc]
