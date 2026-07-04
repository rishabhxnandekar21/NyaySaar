from pydantic import BaseModel

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

from app.schemas.user import UserResponse

TokenResponse.model_rebuild()