from datetime import datetime, timedelta, timezone
from jose import jwt
import bcrypt


SECRET_KEY = "SUPER_SECRET_SIGNING_KEY_KEEP_THIS_SAFE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def get_password_hash(password: str) -> str:
    """Generates a secure cryptographic hash using standard bcrypt."""
    
    password_bytes = password.encode('utf-8')
  
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies if the submitted plain text password matches the database hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Generates a signed JSON Web Token containing user data and expiration timestamp."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt