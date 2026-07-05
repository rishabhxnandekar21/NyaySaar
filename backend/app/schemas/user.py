
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    provider: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)