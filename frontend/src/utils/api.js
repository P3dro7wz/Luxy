import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('photoApp_token');
    const adminToken = localStorage.getItem('admin_token');
    
    if (adminToken && config.url.includes('/admin/')) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('photoApp_token');
      localStorage.removeItem('admin_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  adminLogin: (adminData) => api.post('/auth/admin-login', adminData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Content API
export const contentAPI = {
  getContent: (params = {}) => api.get('/content', { params }),
  getContentById: (id) => api.get(`/content/${id}`),
  getCategories: () => api.get('/categories'),
  likeContent: (contentId) => api.post(`/content/${contentId}/like`),
  rateContent: (contentId, score) => api.post(`/content/${contentId}/rate`, { content_id: contentId, score }),
};

// Collections API
export const collectionsAPI = {
  getCollections: () => api.get('/collections'),
  createCollection: (collectionData) => api.post('/collections', collectionData),
  addItemToCollection: (collectionId, contentId) => api.post(`/collections/${collectionId}/items/${contentId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getContent: (params = {}) => api.get('/admin/content', { params }),
  uploadContent: (formData) => api.post('/admin/content', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateContent: (id, data) => api.put(`/admin/content/${id}`, data),
  deleteContent: (id) => api.delete(`/admin/content/${id}`),
};

export default api;