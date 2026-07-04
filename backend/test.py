from app.config.database import database_engine
from sqlalchemy import text

try:
    with database_engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Database Connected Successfully")
        print("Result:", result.scalar())
except Exception as e:
    print("❌ Connection Failed")
    print(e)