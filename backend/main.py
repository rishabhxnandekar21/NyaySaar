from dotenv import load_dotenv
load_dotenv()

import os
print("MAIN ENV CHECK:", os.getenv("PINECONE_API_KEY"))

from fastapi import FastAPI
from app.api.upload import router as upload_router

from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.summary import router as summary_router
from app.config.settings import Settings

settings = Settings()

app = FastAPI(
    title="NyaySaar API",
    description="AI powered legal assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])   
app.include_router(summary_router, prefix="/api", tags=["Summary"]) 
@app.get("/")
def root():
    return {
        "message": "NyaySaar API running",
        "environment": settings.APP_ENV
    }

@app.on_event("startup")
async def startup_event():
    print("Server started")

@app.on_event("shutdown")
async def shutdown_event():
    print("Server stopped")