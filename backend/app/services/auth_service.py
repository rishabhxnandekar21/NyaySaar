from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UserSignup, UserLogin
from app.config.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def signup(user_data: UserSignup, db_session: Session):

        existing_user = (
            db_session.query(User)
            .filter(User.email == user_data.email)
            .first()
        )

        if existing_user:
            raise ValueError("Email already registered")

        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
        )

        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)

        return new_user

    @staticmethod
    def login(user_data: UserLogin, db_session: Session):

        user = (
            db_session.query(User)
            .filter(User.email == user_data.email)
            .first()
        )

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            user_data.password,
            user.password_hash
        ):
            raise ValueError("Invalid email or password")

        access_token = create_access_token(
            str(user.id)
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }