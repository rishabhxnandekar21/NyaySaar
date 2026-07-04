from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_database_session
from app.schemas.auth import UserSignup, UserLogin
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.schemas.token import TokenResponse
from app.auth.auth_guard import get_current_user
from app.models.user import User

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@auth_router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(
    user_data: UserSignup,
    db_session: Session = Depends(get_database_session)
):
    try:
        return AuthService.signup(user_data, db_session)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@auth_router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user_data: UserLogin,
    db_session: Session = Depends(get_database_session)
):
    try:
        return AuthService.login(user_data, db_session)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error)
        )
    
@auth_router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user