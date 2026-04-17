import os
from typing import List
import fitz  # PyMuPDF


class StorageService:
    def __init__(self, base_path: str = "data"):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

    # SAVE FILE
    def save_file(self, file_name: str, file_bytes: bytes) -> str:
        path = os.path.join(self.base_path, file_name)

        with open(path, "wb") as f:
            f.write(file_bytes)

        return path

    # READ PDF
    def extract_text(self, file_path: str) -> List[str]:
        doc = fitz.open(file_path)
        return [page.get_text() for page in doc]