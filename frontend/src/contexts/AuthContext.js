import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('photoApp_token');
    if (token) {
      // Verify token with backend
      authAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('photoApp_token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.access_token) {
        localStorage.setItem('photoApp_token', response.data.access_token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ email, password, name });
      
      if (response.data.access_token) {
        localStorage.setItem('photoApp_token', response.data.access_token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('photoApp_token');
    setUser(null);
  };

  const saveItem = async (itemId) => {
    if (!user) return;
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with localStorage
      const savedItems = JSON.parse(localStorage.getItem('user_saved_items') || '[]');
      if (!savedItems.includes(itemId)) {
        savedItems.push(itemId);
        localStorage.setItem('user_saved_items', JSON.stringify(savedItems));
        
        setUser(prevUser => ({
          ...prevUser,
          savedItems: savedItems
        }));
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const unsaveItem = async (itemId) => {
    if (!user) return;
    
    try {
      const savedItems = JSON.parse(localStorage.getItem('user_saved_items') || '[]');
      const updatedSavedItems = savedItems.filter(id => id !== itemId);
      localStorage.setItem('user_saved_items', JSON.stringify(updatedSavedItems));
      
      setUser(prevUser => ({
        ...prevUser,
        savedItems: updatedSavedItems
      }));
    } catch (error) {
      console.error('Error unsaving item:', error);
    }
  };

  const createCollection = async (name) => {
    if (!user) return;
    
    try {
      const response = await collectionsAPI.createCollection({ name });
      
      setUser(prevUser => ({
        ...prevUser,
        collections: [...(prevUser.collections || []), response.data]
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, error: 'Failed to create collection' };
    }
  };

  // Load saved items when user logs in
  useEffect(() => {
    if (user) {
      const savedItems = JSON.parse(localStorage.getItem('user_saved_items') || '[]');
      setUser(prevUser => ({
        ...prevUser,
        savedItems: savedItems
      }));
    }
  }, [user?.id]);

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    saveItem,
    unsaveItem,
    createCollection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};