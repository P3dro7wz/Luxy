import React, { useState, useEffect } from 'react';
import { mockCategories } from '../data/mockData';
import GalleryItem from './GalleryItem';
import CategoryFilter from './CategoryFilter';
import { Search, Grid, List } from 'lucide-react';

const Gallery = ({ content, setContent }) => {
  const [filteredContent, setFilteredContent] = useState(content);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let filtered = content;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort content
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredContent(filtered);
  }, [content, selectedCategory, searchTerm, sortBy]);

  const handleLike = (itemId) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === itemId
          ? { ...item, likes: item.likes + 1 }
          : item
      )
    );
  };

  const handleRating = (itemId, rating) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === itemId
          ? {
              ...item,
              rating: ((item.rating * item.ratingCount) + rating) / (item.ratingCount + 1),
              ratingCount: item.ratingCount + 1
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">
            Capturando Momentos
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
            Explore nossa coleção de fotografias e vídeos únicos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Pesquisar fotos e vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            <CategoryFilter
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <div className="flex items-center space-x-4 ml-auto">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
                <option value="popular">Mais Curtidas</option>
                <option value="rating">Melhor Avaliadas</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {filteredContent.length} {filteredContent.length === 1 ? 'item encontrado' : 'itens encontrados'}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredContent.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onLike={handleLike}
              onRate={handleRating}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termo de pesquisa
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;