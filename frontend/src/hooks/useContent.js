import { useState, useEffect } from 'react';
import { contentAPI } from '../utils/api';

export const useContent = (filters = {}) => {
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const [contentResponse, categoriesResponse] = await Promise.all([
        contentAPI.getContent(filters),
        contentAPI.getCategories()
      ]);
      
      setContent(contentResponse.data);
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const likeContent = async (contentId) => {
    try {
      await contentAPI.likeContent(contentId);
      
      // Update local state
      setContent(prevContent =>
        prevContent.map(item =>
          item.id === contentId
            ? { ...item, likes_count: item.likes_count + 1 }
            : item
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error liking content:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to like content'
      };
    }
  };

  const rateContent = async (contentId, score) => {
    try {
      await contentAPI.rateContent(contentId, score);
      
      // Update local state (simplified calculation)
      setContent(prevContent =>
        prevContent.map(item =>
          item.id === contentId
            ? {
                ...item,
                average_rating: ((item.average_rating * item.ratings_count) + score) / (item.ratings_count + 1),
                ratings_count: item.ratings_count + 1
              }
            : item
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error rating content:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to rate content'
      };
    }
  };

  useEffect(() => {
    fetchContent();
  }, [filters.category, filters.search]);

  return {
    content,
    categories,
    isLoading,
    error,
    likeContent,
    rateContent,
    refetch: fetchContent
  };
};