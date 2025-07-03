
import React, { useState, useEffect } from 'react';
import PPEDetectionCamera from '../components/PPEDetectionCamera';
import Preloader from '../components/Preloader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, AlertTriangle, Eye, Sparkles, Zap, Brain, Bot, Activity, Target } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse animation-delay-500"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-12">
        {/* Ultra Modern Header */}
        <div className="text-center space-y-8 py-16">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 animate-spin-slow">
                <Shield className="h-20 w-20 text-cyan-400/50" />
              </div>
              <div className="absolute inset-0 animate-ping">
                <Shield className="h-20 w-20 text-blue-500/30" />
              </div>
              <Shield className="h-20 w-20 text-cyan-400 relative z-10 drop-shadow-2xl" />
            </div>
            <div className="space-y-3">
              <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                EPP Neural AI
              </h1>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30">
                  <Bot className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                    Neural Network Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-light">
            Sistema de <span className="font-bold text-cyan-400 glow">detección inteligente</span> de Equipos de Protección Personal con 
            <span className="font-bold text-purple-400 glow"> redes neuronales avanzadas</span> y análisis en tiempo real
          </p>

          {/* Enhanced Stats badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-blue-500/30 shadow-xl hover:shadow-2xl hover:border-blue-400/50">
                <Brain className="h-6 w-6 text-blue-400 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-blue-400">Red Neuronal</div>
                  <div className="text-xs text-slate-400">Aprendizaje Profundo</div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-emerald-500/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-green-500/30 shadow-xl hover:shadow-2xl hover:border-green-400/50">
                <Activity className="h-6 w-6 text-green-400 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-green-400">Tiempo Real</div>
                  <div className="text-xs text-slate-400">Procesamiento Instantáneo</div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-500/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-purple-500/30 shadow-xl hover:shadow-2xl hover:border-purple-400/50">
                <Target className="h-6 w-6 text-purple-400 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-purple-400">Alta Precisión</div>
                  <div className="text-xs text-slate-400">99.2% Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-7 w-7 text-cyan-400" />
                </div>
                <span className="text-slate-200">Detección Neural</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-slate-400 text-base leading-relaxed">
                Análisis en tiempo real con <span className="text-cyan-400 font-semibold">redes neuronales convolucionales</span> para 
                detección precisa de equipos de protección con máxima eficiencia
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-7 w-7 text-purple-400" />
                </div>
                <span className="text-slate-200">IA Adaptativa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-slate-400 text-base leading-relaxed">
                <span className="text-purple-400 font-semibold">Aprendizaje automático</span> que mejora constantemente 
                la precisión mediante entrenamiento continuo con nuevas imágenes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl border border-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-7 w-7 text-orange-400" />
                </div>
                <span className="text-slate-200">Alertas Predictivas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-slate-400 text-base leading-relaxed">
                Sistema de <span className="text-orange-400 font-semibold">alertas inteligentes</span> con análisis predictivo 
                para prevenir accidentes antes de que ocurran
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced EPP Detection Grid */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-2xl border-slate-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl text-center flex items-center justify-center space-x-4 text-slate-200">
              <div className="relative">
                <Shield className="h-8 w-8 text-cyan-400" />
                <div className="absolute inset-0 animate-ping">
                  <Shield className="h-8 w-8 text-cyan-400/50" />
                </div>
              </div>
              <span>Equipos de Protección Detectados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { emoji: "⛑️", name: "Casco", color: "blue", desc: "Protección craneal" },
                { emoji: "🧤", name: "Guantes", color: "green", desc: "Protección manual" },
                { emoji: "🥽", name: "Gafas", color: "yellow", desc: "Protección ocular" },
                { emoji: "😷", name: "Mascarilla", color: "purple", desc: "Protección respiratoria" },
                { emoji: "🦺", name: "Chaleco", color: "orange", desc: "Visibilidad y protección" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl text-center hover:bg-gradient-to-br hover:from-slate-700/50 hover:to-slate-800/50 transition-all duration-500 hover:scale-105 cursor-pointer border border-slate-700/30 hover:border-slate-600/50 shadow-xl hover:shadow-2xl"
                >
                  <div className="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                    {item.emoji}
                  </div>
                  <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors text-lg mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Detection Component */}
        <PPEDetectionCamera />

        {/* Ultra Modern Footer */}
        <Card className="bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl text-white border-slate-700/50 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-purple-600/10 to-pink-600/5"></div>
          <CardContent className="p-10 relative z-10">
            <div className="text-center space-y-8">
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-yellow-400">React + TypeScript</div>
                    <div className="text-xs text-slate-400">Framework Moderno</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-lg border border-blue-400/30">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-blue-400">DeepSeek Neural AI</div>
                    <div className="text-xs text-slate-400">Red Neuronal Avanzada</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-lg border border-green-400/30">
                    <Activity className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-green-400">Tiempo Real</div>
                    <div className="text-xs text-slate-400">Procesamiento Instantáneo</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-700/50 pt-8">
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
                  <p className="text-slate-300 text-base leading-relaxed max-w-5xl mx-auto">
                    <span className="text-2xl">🚀</span> <strong className="text-cyan-400">Instrucciones:</strong> Permita el acceso a la cámara, active la transmisión y 
                    use <span className="text-green-400 font-semibold">"Detectar EPP"</span> para análisis manual o active la 
                    <span className="text-yellow-400 font-semibold"> "Auto-detección Neural"</span> para monitoreo continuo inteligente con IA.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
