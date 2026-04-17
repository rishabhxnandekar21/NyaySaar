from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    # Groq
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama3-70b-8192"

    # HuggingFace
    HF_MODEL_NAME: str = "sentence-transformers/intfloat/multilingual-e5-base"

    # Pinecone
    PINECONE_API_KEY: str
    PINECONE_ENV: str
    PINECONE_INDEX_NAME: str

    # AWS
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET_NAME: str

    # App
    APP_ENV: str = "development"
    PORT: int = 8000

    # Security
    SECRET_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # RAG / Memory
    MEMORY_TOP_K: int = 5
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()