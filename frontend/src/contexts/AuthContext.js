import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Check if user is logged in (mock check)
    const savedUser = localStorage.getItem('photoApp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        collections: [],
        savedItems: []
      };
      
      localStorage.setItem('photoApp_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        collections: [],
        savedItems: []
      };
      
      localStorage.setItem('photoApp_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('photoApp_user');
    setUser(null);
  };

  const saveItem = (itemId) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedItems: [...user.savedItems, itemId]
    };
    
    localStorage.setItem('photoApp_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const unsaveItem = (itemId) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedItems: user.savedItems.filter(id => id !== itemId)
    };
    
    localStorage.setItem('photoApp_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const createCollection = (name) => {
    if (!user) return;
    
    const newCollection = {
      id: Date.now().toString(),
      name: name,
      items: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedUser = {
      ...user,
      collections: [...user.collections, newCollection]
    };
    
    localStorage.setItem('photoApp_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

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