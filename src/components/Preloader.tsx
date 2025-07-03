
import React, { useEffect, useState } from 'react';
import { Shield, Zap, Sparkles, Bot } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-hidden">
      {/* Enhanced animated background patterns */}
      <div className="absolute inset-0">
        {/* Vibrant gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
        
        {/* Abstract geometric shapes */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 transform rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-violet-400/25 to-fuchsia-500/25 rounded-full animate-float"></div>
        
        {/* Dynamic grid with neon effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-bounce animation-delay-200"></div>
        <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce animation-delay-300"></div>
      </div>

      {/* Main content with enhanced design */}
      <div className="relative z-10 text-center">
        {/* Multi-layered logo with neon effects */}
        <div className="mb-12 relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-400/30"></div>
          </div>
          <div className="absolute inset-0 animate-pulse animation-delay-300">
            <div className="w-28 h-28 mx-auto mt-2 ml-2 rounded-full border-2 border-pink-400/40"></div>
          </div>
          
          {/* Central icon with multiple effects */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full animate-pulse animation-delay-200"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text" />
            </div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin-slow">
            <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-400" />
            <Zap className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-6 w-6 text-cyan-400" />
            <Bot className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-6 text-pink-400" />
          </div>
        </div>

        {/* Enhanced title with gradient and glow */}
        <div className="mb-8 space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent leading-tight animate-glow-pulse">
            Sistema EPP AI
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-full border border-purple-400/50">
              <span className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text uppercase tracking-wider">
                Neural Network Powered
              </span>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
          </div>
        </div>

        <p className="text-xl text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text mb-12 animate-fade-in animation-delay-300 max-w-2xl mx-auto">
          Inicializando detección inteligente con redes neuronales...
        </p>

        {/* Ultra modern progress bar */}
        <div className="w-96 mx-auto mb-8 relative">
          {/* Background track with neon glow */}
          <div className="h-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full overflow-hidden border border-slate-600 shadow-inner">
            {/* Animated progress with multiple gradients */}
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-500 rounded-full transition-all duration-100 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              {/* Pulsing glow */}
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Progress glow effect */}
          <div 
            className="absolute top-0 h-3 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 rounded-full blur-sm -z-10 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Enhanced progress text */}
        <div className="space-y-4 mb-8">
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text">
            {progress}% Completado
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-green-300">Neural Network</span>
            </div>
            <div className="w-px h-4 bg-slate-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse animation-delay-200"></div>
              <span className="text-blue-300">Deep Learning</span>
            </div>
            <div className="w-px h-4 bg-slate-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse animation-delay-400"></div>
              <span className="text-purple-300">AI Processing</span>
            </div>
          </div>
        </div>

        {/* Enhanced loading animation */}
        <div className="flex justify-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>

        {/* Abstract decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 border border-cyan-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 border-2 border-pink-400/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Preloader;
