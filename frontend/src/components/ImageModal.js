import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Heart, Star, Bookmark, Download, Share2, Play } from 'lucide-react';

const ImageModal = ({ item, isOpen, onClose, onLike, onRate, isLiked, userRating }) => {
  const { user, saveItem, unsaveItem } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSaved = user?.savedItems?.includes(item.id);

  const handleSave = () => {
    if (user) {
      if (isSaved) {
        unsaveItem(item.id);
      } else {
        saveItem(item.id);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Media Container */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="relative max-w-full max-h-full">
            {item.type === 'video' ? (
              <div className="relative">
                <video
                  controls
                  className="max-w-full max-h-[80vh] object-contain"
                  poster={item.thumbnail}
                >
                  <source src={item.url} type="video/mp4" />
                  Seu navegador não suporta vídeos HTML5.
                </video>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:w-96 lg:h-full bg-white lg:overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {item.description}
              </p>
              <div className="text-sm text-gray-500">
                Enviado em {formatDate(item.uploadDate)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{item.likes}</div>
                <div className="text-sm text-gray-600">Curtidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{item.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-6">
              {/* Like Button */}
              <button
                onClick={onLike}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Curtido' : 'Curtir'}</span>
              </button>

              {/* Save Button */}
              {user && (
                <button
                  onClick={handleSave}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    isSaved
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-all"
              >
                <Share2 className="h-5 w-5" />
                <span>Partilhar</span>
              </button>
            </div>

            {/* Rating Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Avalie este {item.type === 'video' ? 'vídeo' : 'foto'}
              </h3>
              
              {userRating > 0 ? (
                <div className="text-center py-4">
                  <div className="flex justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= userRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">Obrigado pela sua avaliação!</p>
                </div>
              ) : (
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onRate(star)}
                      className="transition-all hover:scale-110"
                    >
                      <Star className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center text-sm text-gray-600">
                Média: {item.rating.toFixed(1)} de 5 ({item.ratingCount} avaliações)
              </div>
            </div>

            {/* Technical Info */}
            {item.type === 'video' && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações do Vídeo
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span className="text-gray-900">{item.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="text-gray-900 capitalize">{item.category}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;