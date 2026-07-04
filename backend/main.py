from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.config.database import Base, database_engine

from app.models.user import User

from app.api.auth import auth_router
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.summary import router as summary_router


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
app.include_router(auth_router)
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
    Base.metadata.create_all(bind=database_engine)
    print("Database tables created.")
    print("Server started")

@app.on_event("shutdown")
async def shutdown_event():
    print("Server stopped")

