
import React, { useState, useEffect } from 'react';
import PPEDetectionCamera from '../components/PPEDetectionCamera';
import Preloader from '../components/Preloader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, AlertTriangle, Eye, Sparkles, Zap, Brain, Bot, Activity, Target, Users, GraduationCap } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-red-950 to-blue-900 relative overflow-hidden">
      {/* Enhanced Background decorative elements con colores UCV */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-red-600/25 to-blue-600/25 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-red-400/20 rounded-full blur-2xl animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-700"></div>
        
        {/* Animated grid pattern con colores UCV */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-12">
        {/* Header Universidad César Vallejo */}
        <div className="text-center space-y-8 py-16">
          {/* Logo UCV y título principal */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 animate-spin-slow">
                  <GraduationCap className="h-16 w-16 text-blue-400/60" />
                </div>
                <div className="absolute inset-0 animate-ping">
                  <Shield className="h-16 w-16 text-red-500/40" />
                </div>
                <Shield className="h-16 w-16 text-blue-500 relative z-10 drop-shadow-2xl" />
              </div>
              <div className="text-center">
                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-red-500 to-blue-600 bg-clip-text text-transparent leading-tight animate-glow-pulse">
                  EPP AI Neural
                </h1>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                  <span className="text-lg font-bold text-blue-300">Universidad César Vallejo</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/30 to-red-500/30 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400/50 shadow-xl">
                <Bot className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-bold text-blue-200 uppercase tracking-wider">
                  Inteligencia Artificial Avanzada
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed font-light">
            Sistema universitario de <span className="font-bold text-blue-400 glow">detección inteligente</span> de Equipos de Protección Personal 
            con <span className="font-bold text-red-400 glow">redes neuronales profundas</span> y análisis en tiempo real
          </p>

          {/* Enhanced Stats badges con colores UCV */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-600/40 to-blue-500/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-blue-400/60 shadow-xl hover:shadow-blue-500/25 hover:border-blue-300/70">
                <Brain className="h-6 w-6 text-blue-300 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-blue-200">Red Neuronal</div>
                  <div className="text-xs text-blue-300">Deep Learning UCV</div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-red-600/40 to-red-500/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-red-400/60 shadow-xl hover:shadow-red-500/25 hover:border-red-300/70">
                <Activity className="h-6 w-6 text-red-300 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-red-200">Tiempo Real</div>
                  <div className="text-xs text-red-300">Procesamiento Instantáneo</div>
                </div>
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/40 to-red-500/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-purple-400/60 shadow-xl hover:shadow-purple-500/25 hover:border-purple-300/70">
                <Target className="h-6 w-6 text-purple-300 group-hover:animate-pulse" />
                <div className="text-left">
                  <div className="text-sm font-bold text-purple-200">Alta Precisión</div>
                  <div className="text-xs text-purple-300">99.5% Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Features Grid con colores UCV */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-900/60 to-blue-800/60 backdrop-blur-xl border-blue-400/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-blue-400/40 to-blue-600/40 rounded-xl border border-blue-400/60 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-7 w-7 text-blue-200" />
                </div>
                <span className="text-blue-100">Detección Neural UCV</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-blue-200 text-base leading-relaxed">
                Análisis universitario con <span className="text-blue-300 font-semibold">redes neuronales convolucionales</span> desarrolladas 
                en la Universidad César Vallejo para máxima precisión académica
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/60 to-red-800/60 backdrop-blur-xl border-red-400/50 shadow-2xl hover:shadow-red-500/30 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-red-400/40 to-red-600/40 rounded-xl border border-red-400/60 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-7 w-7 text-red-200" />
                </div>
                <span className="text-red-100">IA Adaptativa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-red-200 text-base leading-relaxed">
                <span className="text-red-300 font-semibold">Aprendizaje automático</span> con algoritmos desarrollados 
                por estudiantes UCV que mejoran constantemente la precisión
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/60 to-purple-800/60 backdrop-blur-xl border-purple-400/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center space-x-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-purple-400/40 to-purple-600/40 rounded-xl border border-purple-400/60 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-7 w-7 text-purple-200" />
                </div>
                <span className="text-purple-100">Alertas Predictivas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-purple-200 text-base leading-relaxed">
                Sistema de <span className="text-purple-300 font-semibold">alertas inteligentes</span> con análisis predictivo 
                para prevenir accidentes laborales universitarios
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced EPP Detection Grid con colores UCV */}
        <Card className="bg-gradient-to-br from-slate-900/40 to-slate-800/40 backdrop-blur-2xl border-blue-400/40 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-red-500/10 to-blue-600/10"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl text-center flex items-center justify-center space-x-4 text-white">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-400" />
                <div className="absolute inset-0 animate-ping">
                  <Shield className="h-8 w-8 text-red-400/50" />
                </div>
              </div>
              <span>Equipos de Protección Personal - UCV</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { emoji: "⛑️", name: "Casco", color: "blue", desc: "Protección craneal certificada" },
                { emoji: "🧤", name: "Guantes", color: "red", desc: "Protección manual industrial" },
                { emoji: "🥽", name: "Gafas", color: "blue", desc: "Protección ocular UV" },
                { emoji: "😷", name: "Mascarilla", color: "red", desc: "Protección respiratoria N95" },
                { emoji: "🦺", name: "Chaleco", color: "blue", desc: "Visibilidad y protección" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`group p-8 bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-3xl text-center hover:bg-gradient-to-br ${
                    item.color === 'blue' 
                      ? 'hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-400/30 hover:border-blue-400/60' 
                      : 'hover:from-red-600/30 hover:to-red-700/30 border border-red-400/30 hover:border-red-400/60'
                  } transition-all duration-500 hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                    {item.emoji}
                  </div>
                  <h3 className={`font-bold group-hover:text-${item.color}-300 transition-colors text-lg mb-2 text-white`}>
                    {item.name}
                  </h3>
                  <p className={`text-xs text-slate-300 group-hover:text-${item.color}-300 transition-colors`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Detection Component */}
        <PPEDetectionCamera />

        {/* Footer moderno con créditos UCV */}
        <Card className="bg-gradient-to-r from-blue-900/90 via-red-900/90 to-blue-900/90 backdrop-blur-xl text-white border-blue-400/40 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-blue-600/10"></div>
          <CardContent className="p-10 relative z-10">
            <div className="text-center space-y-8">
              {/* Créditos principales */}
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/40 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <GraduationCap className="h-8 w-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-blue-300">Universidad César Vallejo</h3>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-lg">
                  <div className="flex items-center space-x-2 group hover:scale-105 transition-transform">
                    <Users className="h-6 w-6 text-red-400" />
                    <div className="text-center">
                      <div className="font-bold text-red-300">Desarrollado por:</div>
                      <div className="text-white font-semibold">Carla y David</div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mt-4">
                  Proyecto de investigación en Inteligencia Artificial aplicada a la Seguridad Industrial
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-lg border border-blue-400/50">
                    <Zap className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-blue-300">React + TypeScript</div>
                    <div className="text-xs text-blue-200">Framework Moderno UCV</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-red-400/30 to-red-600/30 rounded-lg border border-red-400/50">
                    <Brain className="h-5 w-5 text-red-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-red-300">Neural Networks UCV</div>
                    <div className="text-xs text-red-200">Investigación Académica</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                  <div className="p-2 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-lg border border-purple-400/50">
                    <Activity className="h-5 w-5 text-purple-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-purple-300">Tiempo Real</div>
                    <div className="text-xs text-purple-200">Procesamiento UCV</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-blue-400/30 pt-8">
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/40">
                  <p className="text-slate-100 text-base leading-relaxed max-w-5xl mx-auto">
                    <span className="text-2xl">🎓</span> <strong className="text-blue-300">Instrucciones UCV:</strong> Permita el acceso a la cámara, active la transmisión y 
                    use <span className="text-red-300 font-semibold">"Detectar EPP"</span> para análisis manual o active la 
                    <span className="text-blue-300 font-semibold"> "Auto-detección Neural"</span> para monitoreo continuo con IA universitaria.
                  </p>
                  
                  <div className="mt-4 text-center">
                    <div className="text-sm text-slate-400">
                      © 2024 Universidad César Vallejo - Escuela de Ingeniería de Sistemas
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Proyecto de Tesis: "Sistema de Detección de EPP mediante Inteligencia Artificial"
                    </div>
                  </div>
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
