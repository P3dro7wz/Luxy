import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';
import Collections from './components/Collections';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './contexts/AuthContext';
import { mockPhotos, mockVideos } from './data/mockData';

function App() {
  const [content, setContent] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading content from API
    const allContent = [...mockPhotos, ...mockVideos].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    setContent(allContent);
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Header onOpenAuth={() => setIsAuthModalOpen(true)} />
          <Routes>
            <Route path="/" element={<Gallery content={content} setContent={setContent} />} />
            <Route path="/admin" element={<AdminPanel content={content} setContent={setContent} />} />
            <Route path="/collections" element={<Collections />} />
          </Routes>
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;