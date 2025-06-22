import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, User, Settings, Heart, LogOut } from 'lucide-react';

const Header = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Camera className="h-8 w-8 text-black group-hover:text-gray-600 transition-colors" />
            <span className="text-xl font-light text-black">PhotoStudio</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                isActive('/') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
              }`}
            >
              Galeria
            </Link>
            
            {user && (
              <Link
                to="/collections"
                className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                  isActive('/collections') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
                }`}
              >
                Minhas Coleções
              </Link>
            )}
            
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-gray-600 ${
                isActive('/admin') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-700'
              }`}
            >
              Admin
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Olá, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm hidden sm:block">Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;