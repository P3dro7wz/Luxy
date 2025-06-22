from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(enum.Enum):
    CLIENT = "client"
    ADMIN = "admin"

# Association table for collections and content items (many-to-many)
collection_items = Table(
    'collection_items',
    Base.metadata,
    Column('collection_id', Integer, ForeignKey('collections.id'), primary_key=True),
    Column('content_id', Integer, ForeignKey('content.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.CLIENT.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    collections = relationship("Collection", back_populates="user")
    likes = relationship("Like", back_populates="user")
    ratings = relationship("Rating", back_populates="user")

class Content(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    file_path = Column(String(500), nullable=False)  # Path to the actual file
    thumbnail_path = Column(String(500))  # Path to thumbnail
    file_type = Column(String(50), nullable=False)  # 'photo' or 'video'
    category = Column(String(100), nullable=False)
    file_size = Column(Integer)  # File size in bytes
    duration = Column(String(20))  # Video duration (e.g., "02:30")
    width = Column(Integer)  # Image/video width
    height = Column(Integer)  # Image/video height
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    is_published = Column(Boolean, default=True)

    # Relationships
    likes = relationship("Like", back_populates="content")
    ratings = relationship("Rating", back_populates="content")
    collections = relationship("Collection", secondary=collection_items, back_populates="items")

    # Computed properties
    @property
    def likes_count(self):
        return len(self.likes)

    @property
    def average_rating(self):
        if not self.ratings:
            return 0.0
        return sum(rating.score for rating in self.ratings) / len(self.ratings)

    @property
    def ratings_count(self):
        return len(self.ratings)

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for anonymous likes
    content_id = Column(Integer, ForeignKey("content.id"), nullable=False)
    ip_address = Column(String(45))  # For anonymous likes tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="likes")
    content = relationship("Content", back_populates="likes")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for anonymous ratings
    content_id = Column(Integer, ForeignKey("content.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 1-5 stars
    ip_address = Column(String(45))  # For anonymous ratings tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="ratings")
    content = relationship("Content", back_populates="ratings")

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="collections")
    items = relationship("Content", secondary=collection_items, back_populates="collections")

class AdminSettings(Base):
    __tablename__ = "admin_settings"

    id = Column(Integer, primary_key=True, index=True)
    site_title = Column(String(255), default="PhotoStudio")
    site_description = Column(Text)
    contact_email = Column(String(255))
    allow_anonymous_ratings = Column(Boolean, default=True)
    allow_anonymous_likes = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())