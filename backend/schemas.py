from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from enum import Enum

class UserRole(str, Enum):
    CLIENT = "client"
    ADMIN = "admin"

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Content Schemas
class ContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str

class ContentCreate(ContentBase):
    file_type: str

class ContentUpdate(ContentBase):
    is_published: Optional[bool] = None

class Content(ContentBase):
    id: int
    file_path: str
    thumbnail_path: Optional[str] = None
    file_type: str
    file_size: Optional[int] = None
    duration: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    upload_date: datetime
    is_published: bool
    likes_count: int
    average_rating: float
    ratings_count: int

    class Config:
        from_attributes = True

# Like Schema
class LikeCreate(BaseModel):
    content_id: int

class Like(BaseModel):
    id: int
    content_id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Rating Schema
class RatingCreate(BaseModel):
    content_id: int
    score: int  # 1-5

class Rating(BaseModel):
    id: int
    content_id: int
    user_id: Optional[int] = None
    score: int
    created_at: datetime

    class Config:
        from_attributes = True

# Collection Schemas
class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None

class CollectionCreate(CollectionBase):
    pass

class Collection(CollectionBase):
    id: int
    user_id: int
    created_at: datetime
    items: List[Content] = []

    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[User] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Admin Settings Schema
class AdminSettingsBase(BaseModel):
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    contact_email: Optional[str] = None
    allow_anonymous_ratings: Optional[bool] = None
    allow_anonymous_likes: Optional[bool] = None

class AdminSettings(AdminSettingsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Statistics Schema
class ContentStats(BaseModel):
    total_content: int
    total_photos: int
    total_videos: int
    total_likes: int
    total_ratings: int
    average_rating: float

class UserStats(BaseModel):
    total_users: int
    total_collections: int