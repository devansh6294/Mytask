from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import engine
import features
import schemas
import auth

app = FastAPI(title="Task Manager API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = engine.session()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
        
  
    user = features.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user




@app.post("/signup", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = features.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return features.create_user(db=db, user_schema=user)


@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = features.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate the access token payload with user identification
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



@app.post("/task")
def create_task(task: schemas.task_post, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    features.create_task(db, task, user_id=current_user.user_id)
    return "User successfully created task"


@app.get("/task", response_model=list[schemas.res_model])
def get_all_task(db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
   return features.get_all(db, user_id=current_user.user_id)


@app.delete("/task")
def del_complete_task(current_user: schemas.UserOut = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fixed bug: Correctly points to features.completed matching your features.py implementation
    return features.completed(db, current_user.user_id)



@app.get("/task/status")
def get_stats(current_user: schemas.UserOut = Depends(get_current_user), db: Session = Depends(get_db)):
    return features.stats(db, current_user.user_id)



@app.get("/task/{task_id}", response_model=schemas.res_model)
def get_curr_task(task_id: int, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    curr_task = features.my_task(db, task_id, user_id=current_user.user_id)
    if curr_task is None:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized access")
    return curr_task



@app.put("/task/{task_id}")
def update_task(task_id: int, status: str | None = None, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    return features.update_mytask(db, task_id, status, user_id=current_user.user_id)
    

@app.delete("/task/{task_id}")
def del_task(task_id: int, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    return features.delete_task(db, task_id, user_id=current_user.user_id)