from sqlalchemy.orm import Session
from tables import task, User
from datetime import timedelta
import auth
from sqlalchemy import func


# --- User CRUD Logic ---

def create_user(db: Session, user_schema):
    hashed_pwd = auth.get_password_hash(user_schema.password)
    db_user = User(
        username=user_schema.username,
        email=user_schema.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


# --- Task CRUD Logic (Scoped to Logged-In User) ---

def create_task(db: Session, user, user_id: int):
    oink = task(
        title=user.title,
        description=user.description,
        priority=user.priority,
        due_date=user.start_date + timedelta(days=user.due),
        start_date=user.start_date,
        status="just started",
        user_id=user_id  # Implicitly link the task to the current authenticated user
    )
    db.add(oink)
    db.commit()
    db.refresh(oink)
    return oink


def get_all(db: Session, user_id: int):
    # Retrieve ONLY tasks where user_id matches
    return db.query(task).filter(task.user_id == user_id).all()


def my_task(db: Session, task_id: int, user_id: int):
    # Find task matching the ID AND belonging to the current user
    return db.query(task).filter(task.task_id == task_id, task.user_id == user_id).first()


def update_mytask(db: Session, task_id: int, curr_status: str | None, user_id: int):
    if curr_status is not None:
        oink = db.query(task).filter(task.task_id == task_id, task.user_id == user_id).update({"status": curr_status})
        db.commit()
        if oink == 0:
            return "This task doesn't exist or you don't have access to it"
        else:
            return "Task updated successfully"
    else:
        return "Please provide the update status"
    

def delete_task(db: Session, task_id: int, user_id: int):
    oink = db.query(task).filter(task.task_id == task_id, task.user_id == user_id).delete()
    db.commit()
    if oink == 0:
        return "Task doesn't exist or you don't have access to it"
    else:
        return "Task deleted successfully"
    
def completed(db:Session,user_id:int):
    oink=db.query(task).filter(task.user_id==user_id, task.status=="completed").delete()
    db.commit()
    return "completed task deleted successfully"



def stats(db:Session,user_id:int):
    results = db.query(task.status, func.count(task.task_id)).filter(task.user_id == user_id).group_by(task.status).all()
    return results
