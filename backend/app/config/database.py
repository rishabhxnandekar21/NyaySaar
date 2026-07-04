from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config.settings import settings

database_engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

DatabaseSession = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=database_engine
)

Base = declarative_base()


def get_database_session():
    db_session = DatabaseSession()
    try:
        yield db_session
    finally:
        db_session.close()