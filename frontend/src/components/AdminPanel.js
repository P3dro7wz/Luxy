import React, { useState, useRef } from 'react';
import { Upload, Image, Video, X, Plus, Save, Eye, Trash2, Edit3 } from 'lucide-react';

const AdminPanel = ({ content, setContent }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'portrait'
  });
  const [previewMode, setPreviewMode] = useState('grid');
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'portrait', label: 'Retratos' },
    { value: 'wedding', label: 'Casamentos' },
    { value: 'event', label: 'Eventos' },
    { value: 'family', label: 'Família' },
    { value: 'nature', label: 'Natureza' },
    { value: 'architecture', label: 'Arquitetura' },
    { value: 'urban', label: 'Urbano' }
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !uploadData.title) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create new content items
      const newItems = selectedFiles.map((file, index) => ({
        id: Date.now().toString() + index,
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: selectedFiles.length > 1 ? `${uploadData.title} ${index + 1}` : uploadData.title,
        category: uploadData.category,
        description: uploadData.description,
        uploadDate: new Date().toISOString(),
        likes: 0,
        rating: 0,
        ratingCount: 0,
        duration: file.type.startsWith('video/') ? '00:00' : undefined
      }));

      setContent(prevContent => [...newItems, ...prevContent]);

      // Reset form
      setSelectedFiles([]);
      setUploadData({
        title: '',
        description: '',
        category: 'portrait'
      });
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({
      ...item,
      originalId: item.id
    });
  };

  const saveEdit = () => {
    if (editingItem) {
      setContent(prevContent =>
        prevContent.map(item =>
          item.id === editingItem.originalId
            ? {
                ...item,
                title: editingItem.title,
                description: editingItem.description,
                category: editingItem.category
              }
            : item
        )
      );
      setEditingItem(null);
    }
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setContent(prevContent => prevContent.filter(item => item.id !== itemId));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie o conteúdo do seu portfólio de fotografia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Novo Upload
              </h2>

              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex space-x-2 mb-4">
                      <Image className="h-8 w-8 text-gray-400" />
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      Clique para selecionar arquivos
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporte para imagens e vídeos
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mb-6 max-h-40 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Arquivos Selecionados ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {file.type.startsWith('video/') ? (
                            <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Image className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Título da foto/vídeo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Descrição opcional..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Enviando...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0 || !uploadData.title}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Enviando...' : 'Enviar Arquivos'}</span>
              </button>
            </div>
          </div>

          {/* Content Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Conteúdo Publicado ({content.length})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('grid')}
                    className={`p-2 rounded ${
                      previewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-gray-400 rounded-sm"></div>
                      <div className="bg-gray-400 rounded-sm"></div>
                      <div className="bg-gray-400 rounded-sm"></div>
                      <div className="bg-gray-400 rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPreviewMode('list')}
                    className={`p-2 rounded ${
                      previewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="bg-gray-400 h-1 w-4 rounded"></div>
                      <div className="bg-gray-400 h-1 w-4 rounded"></div>
                      <div className="bg-gray-400 h-1 w-4 rounded"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content Grid/List */}
              <div className={`${
                previewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }`}>
                {content.map((item) => (
                  <div
                    key={item.id}
                    className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                      previewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`${previewMode === 'list' ? 'w-32 h-24' : 'aspect-[4/3]'} relative`}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'video' && (
                        <div className="absolute top-2 left-2">
                          <Video className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-3 ${previewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {item.title}
                        </h3>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="capitalize">{item.category}</p>
                        <div className="flex justify-between">
                          <span>{item.likes} curtidas</span>
                          <span>{item.rating.toFixed(1)}★ ({item.ratingCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {content.length === 0 && (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Nenhum conteúdo publicado
                  </h3>
                  <p className="text-gray-500">
                    Comece enviando suas primeiras fotos e vídeos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Editar Item
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;