import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Star, Bookmark, Play, Clock, Eye } from 'lucide-react';
import ImageModal from './ImageModal';

const GalleryItem = ({ item, onLike, onRate, viewMode }) => {
  const { user, saveItem, unsaveItem } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = user?.savedItems?.includes(item.id);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike(item.id);
    }
  };

  const handleRating = (rating) => {
    if (userRating === 0) {
      setUserRating(rating);
      onRate(item.id, rating);
    }
  };

  const handleSave = () => {
    if (user) {
      if (isSaved) {
        unsaveItem(item.id);
      } else {
        saveItem(item.id);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="flex">
          <div 
            className="relative w-80 h-48 flex-shrink-0 cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                <Play className="h-12 w-12 text-white" fill="currentColor" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                {item.type === 'video' ? 'Vídeo' : 'Foto'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <p className="text-sm text-gray-500">Enviado em {formatDate(item.uploadDate)}</p>
              </div>
              
              {user && (
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{item.likes}</span>
                </button>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        disabled={userRating > 0}
                        className={`transition-colors ${
                          userRating > 0 ? 'cursor-not-allowed' : 'hover:text-yellow-400'
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= (userRating || Math.floor(item.rating))
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.rating.toFixed(1)} ({item.ratingCount})
                  </span>
                </div>
                
                {item.type === 'video' && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{item.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image/Video Container */}
        <div 
          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Video Overlay */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
              <Play className="h-16 w-16 text-white opacity-80" fill="currentColor" />
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {item.type === 'video' ? 'Vídeo' : 'Foto'}
            </span>
          </div>

          {/* Save Button */}
          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                isSaved
                  ? 'bg-black/80 text-white'
                  : 'bg-white/80 text-gray-700 hover:bg-black/80 hover:text-white'
              } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Video Duration */}
          {item.type === 'video' && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {item.duration}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-black transition-colors">
            {item.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-all hover:scale-105 ${
                  isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{item.likes}</span>
              </button>

              {/* Rating Display */}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 font-medium">
                  {item.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({item.ratingCount})
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(item.uploadDate)}
            </div>
          </div>

          {/* Rating Stars */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avalie:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    disabled={userRating > 0}
                    className={`transition-all hover:scale-110 ${
                      userRating > 0 ? 'cursor-not-allowed opacity-50' : 'hover:text-yellow-400'
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        star <= userRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {userRating > 0 && (
              <p className="text-xs text-gray-500 mt-1 text-right">
                Obrigado pela avaliação!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ImageModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleLike}
        onRate={handleRating}
        isLiked={isLiked}
        userRating={userRating}
      />
    </>
  );
};

export default GalleryItem;