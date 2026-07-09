from pydantic import BaseModel, ConfigDict
from datetime import date

# --- User Management Schemas ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    user_id: int
    username: str
    email: str
    
    model_config = ConfigDict(from_attributes=True)

# --- Authentication Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None


# --- Task Management Schemas ---
class task_post(BaseModel):
    title: str
    description: str
    priority: int
    due: int
    start_date: date

class res_model(BaseModel):
    task_id: int
    title: str
    description: str
    priority: int
    status: str
    due_date: date
    start_date: date
     
    model_config = ConfigDict(from_attributes=True)