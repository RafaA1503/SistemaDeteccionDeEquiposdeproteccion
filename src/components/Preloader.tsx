
import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-lg animate-pulse animation-delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-ping">
            <Shield className="h-20 w-20 text-blue-400/50 mx-auto" />
          </div>
          <Shield className="h-20 w-20 text-blue-400 mx-auto animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
          Sistema EPP AI
        </h1>
        <p className="text-blue-200 text-lg mb-8 animate-fade-in animation-delay-300">
          Inicializando detección inteligente...
        </p>

        {/* Progress bar */}
        <div className="w-80 mx-auto mb-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Progress text */}
        <p className="text-blue-300 text-sm font-medium">
          {progress}% Completado
        </p>

        {/* Loading dots */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
