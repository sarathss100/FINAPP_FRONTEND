"use client";
import React, { useEffect } from 'react';
import { Home, MoveLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = '404 - Page Not Found';
    
    return () => {
      // Reset title when component unmounts
      const defaultTitle = document.querySelector('[data-default]')?.getAttribute('title');
      if (defaultTitle) document.title = defaultTitle;
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#004a7c] text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main error display */}
          <div className="mb-8 relative">
            <h1 className="text-[180px] font-bold leading-none tracking-tighter md:text-[220px] animate-pulse">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-spin-slow">
              <RefreshCw className="w-10 h-10 text-white/70" />
            </div>
          </div>

          {/* Error message */}
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 animate-fade-in">
            Page not found
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-md mx-auto animate-fade-in-delayed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed-more">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-[#004a7c] rounded-lg hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
