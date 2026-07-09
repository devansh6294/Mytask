from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import engine

base = declarative_base()

class User(base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Establishes a relationship: one user can have multiple tasks
    tasks = relationship("task", back_populates="owner")

class task(base):
    __tablename__ = "tasks"
    
    task_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="just started")
    priority = Column(Integer)
    due_date = Column(Date)
    start_date = Column(Date)
    

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    
   
    owner = relationship("User", back_populates="tasks")

base.metadata.create_all(bind=engine.engine)

