import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockPhotos, mockVideos } from '../data/mockData';
import { Plus, Bookmark, Grid, Heart, Star, Trash2, FolderPlus } from 'lucide-react';

const Collections = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [activeTab, setActiveTab] = useState('saved');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Get saved items
    const allContent = [...mockPhotos, ...mockVideos];
    const userSavedItems = allContent.filter(item => 
      user.savedItems?.includes(item.id)
    );
    setSavedItems(userSavedItems);
  }, [user, navigate]);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      // This would be handled by the auth context
      console.log('Creating collection:', newCollectionName);
      setNewCollectionName('');
      setShowCreateCollection(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Minhas Coleções
          </h1>
          <p className="text-gray-600">
            Gerencie suas fotos e vídeos salvos em coleções personalizadas
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'saved'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Itens Salvos</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {savedItems.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'collections'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Grid className="h-4 w-4" />
                  <span>Coleções</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {user.collections?.length || 0}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'saved' && (
          <div>
            {savedItems.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Nenhum item salvo ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece a salvar suas fotos e vídeos favoritos da galeria
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Explorar Galeria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {item.type === 'video' && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                            Vídeo
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{item.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'collections' && (
          <div>
            {/* Create Collection Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowCreateCollection(true)}
                className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Coleção</span>
              </button>
            </div>

            {/* Collections Grid */}
            {user.collections?.length === 0 ? (
              <div className="text-center py-20">
                <FolderPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Nenhuma coleção criada
                </h3>
                <p className="text-gray-500 mb-6">
                  Crie coleções temáticas para organizar suas fotos favoritas
                </p>
                <button
                  onClick={() => setShowCreateCollection(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Criar Primeira Coleção
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.collections?.map((collection) => (
                  <div key={collection.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Grid className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{collection.name}</h3>
                        <p className="text-sm text-gray-500">
                          {collection.items?.length || 0} itens
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Criado em {new Date(collection.createdAt).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateCollection && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nova Coleção
              </h3>
              <input
                type="text"
                placeholder="Nome da coleção"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-6"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateCollection(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;