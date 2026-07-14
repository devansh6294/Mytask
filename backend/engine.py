from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker
import os

url = os.environ.get("DATABASE_URL", "postgresql://postgres:Devansh%406294@localhost:5432/final_taskmanager")
engine=create_engine(url,echo=True)
session=sessionmaker(bind=engine)


