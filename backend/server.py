from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from typing import List, Optional
import os
import shutil
import uuid
from pathlib import Path
import logging

# Local imports
from database import engine, get_db
from models import Base, User, Content, Like, Rating, Collection, UserRole
import schemas
import auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Create directories for file uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "photos").mkdir(exist_ok=True)
(UPLOAD_DIR / "videos").mkdir(exist_ok=True)
(UPLOAD_DIR / "thumbnails").mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="PhotoStudio API", version="1.0.0")

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to get client IP
def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@api_router.post("/auth/register", response_model=schemas.Token)
async def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth.get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        role=UserRole.CLIENT.value
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@api_router.post("/auth/login", response_model=schemas.Token)
async def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@api_router.post("/auth/admin-login", response_model=schemas.Token)
async def admin_login(admin_data: schemas.AdminLogin):
    if not auth.authenticate_admin(admin_data.username, admin_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    access_token = auth.create_admin_token(admin_data.username)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@api_router.get("/auth/me", response_model=schemas.User)
async def get_current_user_info(current_user: User = Depends(auth.get_current_active_user)):
    return current_user

# ============================================================================
# CONTENT ROUTES (PUBLIC)
# ============================================================================

@api_router.get("/content", response_model=List[schemas.Content])
async def get_content(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Content).filter(Content.is_published == True)
    
    if category and category != "all":
        query = query.filter(Content.category == category)
    
    if search:
        query = query.filter(
            Content.title.contains(search) | 
            Content.description.contains(search)
        )
    
    content = query.offset(skip).limit(limit).all()
    
    # Add computed properties
    for item in content:
        item.likes_count = len(item.likes)
        item.average_rating = item.average_rating
        item.ratings_count = len(item.ratings)
    
    return content

@api_router.get("/content/{content_id}", response_model=schemas.Content)
async def get_content_item(content_id: int, db: Session = Depends(get_db)):
    content = db.query(Content).filter(
        Content.id == content_id,
        Content.is_published == True
    ).first()
    
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return content

@api_router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(
        Content.category,
        func.count(Content.id).label('count')
    ).filter(Content.is_published == True).group_by(Content.category).all()
    
    result = [{"id": "all", "name": "Todas", "count": sum(cat.count for cat in categories)}]
    category_names = {
        "portrait": "Retratos",
        "wedding": "Casamentos", 
        "event": "Eventos",
        "family": "Família",
        "nature": "Natureza",
        "architecture": "Arquitetura",
        "urban": "Urbano"
    }
    
    for cat in categories:
        result.append({
            "id": cat.category,
            "name": category_names.get(cat.category, cat.category.title()),
            "count": cat.count
        })
    
    return result

# ============================================================================
# INTERACTION ROUTES (LIKES & RATINGS)
# ============================================================================

@api_router.post("/content/{content_id}/like")
async def like_content(
    content_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(auth.get_current_user)
):
    # Check if content exists
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.content_id == content_id
    )
    
    if current_user:
        existing_like = existing_like.filter(Like.user_id == current_user.id)
    else:
        client_ip = get_client_ip(request)
        existing_like = existing_like.filter(Like.ip_address == client_ip)
    
    if existing_like.first():
        raise HTTPException(status_code=400, detail="Already liked")
    
    # Create like
    like = Like(
        content_id=content_id,
        user_id=current_user.id if current_user else None,
        ip_address=get_client_ip(request) if not current_user else None
    )
    
    db.add(like)
    db.commit()
    
    return {"message": "Content liked successfully"}

@api_router.post("/content/{content_id}/rate")
async def rate_content(
    content_id: int,
    rating_data: schemas.RatingCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(auth.get_current_user)
):
    # Validate rating score
    if rating_data.score < 1 or rating_data.score > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if content exists
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Check if already rated
    existing_rating = db.query(Rating).filter(
        Rating.content_id == content_id
    )
    
    if current_user:
        existing_rating = existing_rating.filter(Rating.user_id == current_user.id)
    else:
        client_ip = get_client_ip(request)
        existing_rating = existing_rating.filter(Rating.ip_address == client_ip)
    
    if existing_rating.first():
        raise HTTPException(status_code=400, detail="Already rated")
    
    # Create rating
    rating = Rating(
        content_id=content_id,
        score=rating_data.score,
        user_id=current_user.id if current_user else None,
        ip_address=get_client_ip(request) if not current_user else None
    )
    
    db.add(rating)
    db.commit()
    
    return {"message": "Content rated successfully"}

# ============================================================================
# USER COLLECTIONS (AUTHENTICATED)
# ============================================================================

@api_router.get("/collections", response_model=List[schemas.Collection])
async def get_user_collections(
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    collections = db.query(Collection).filter(Collection.user_id == current_user.id).all()
    return collections

@api_router.post("/collections", response_model=schemas.Collection)
async def create_collection(
    collection_data: schemas.CollectionCreate,
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    collection = Collection(
        name=collection_data.name,
        description=collection_data.description,
        user_id=current_user.id
    )
    
    db.add(collection)
    db.commit()
    db.refresh(collection)
    
    return collection

@api_router.post("/collections/{collection_id}/items/{content_id}")
async def add_item_to_collection(
    collection_id: int,
    content_id: int,
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if collection belongs to user
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.user_id == current_user.id
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check if content exists
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Check if already in collection
    if content in collection.items:
        raise HTTPException(status_code=400, detail="Item already in collection")
    
    collection.items.append(content)
    db.commit()
    
    return {"message": "Item added to collection"}

# ============================================================================
# ADMIN ROUTES (PROTECTED)
# ============================================================================

@api_router.get("/admin/stats", response_model=schemas.ContentStats)
async def get_admin_stats(
    db: Session = Depends(get_db),
    _: auth.get_admin_from_credentials = Depends(auth.get_admin_from_credentials)
):
    total_content = db.query(Content).count()
    total_photos = db.query(Content).filter(Content.file_type == "photo").count()
    total_videos = db.query(Content).filter(Content.file_type == "video").count()
    total_likes = db.query(Like).count()
    total_ratings = db.query(Rating).count()
    
    avg_rating = db.query(func.avg(Rating.score)).scalar() or 0.0
    
    return {
        "total_content": total_content,
        "total_photos": total_photos,
        "total_videos": total_videos,
        "total_likes": total_likes,
        "total_ratings": total_ratings,
        "average_rating": float(avg_rating)
    }

@api_router.get("/admin/content", response_model=List[schemas.Content])
async def get_admin_content(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: auth.get_admin_from_credentials = Depends(auth.get_admin_from_credentials)
):
    content = db.query(Content).offset(skip).limit(limit).all()
    return content

# Root route
@api_router.get("/")
async def root():
    return {"message": "PhotoStudio API is running"}

# Include the router in the main app
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)