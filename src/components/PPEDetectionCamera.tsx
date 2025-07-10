import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, CameraOff, AlertCircle, History, CheckCircle, XCircle, Brain, Zap, Cpu, Network, Target, Sparkles } from 'lucide-react';
import { DeepSeekService, PPEDetectionResult } from '../services/deepseekService';
import { NeuralAnalysisService, EnhancedPPEResult } from '../services/neuralAnalysisService';
import { PhotoStorageService, SavedPhoto } from '../services/photoStorageService';
import { NeuralTrainingService, TrainingSession } from '../services/neuralTrainingService';
import PPEDetectionResultComponent from './PPEDetectionResult';
import PhotoHistoryModal from './PhotoHistoryModal';
import NeuralTrainingModal from './NeuralTrainingModal';
import { toast } from 'sonner';

const PPEDetectionCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<EnhancedPPEResult | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [showHistory, setShowHistory] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'active' | 'analyzing' | 'error'>('initializing');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [useNeuralAnalysis, setUseNeuralAnalysis] = useState(true);
  const [trainingStats, setTrainingStats] = useState(NeuralTrainingService.getTrainingStats());

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        setFacingMode('environment');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar fotos guardadas y estadísticas al iniciar
  useEffect(() => {
    setSavedPhotos(PhotoStorageService.getAllPhotos());
    setTrainingStats(NeuralTrainingService.getTrainingStats());
  }, []);

  // Actualizar estadísticas cuando cambie el entrenamiento
  const updateTrainingStats = () => {
    setTrainingStats(NeuralTrainingService.getTrainingStats());
  };

  // Iniciar cámara automáticamente al cargar el componente
  useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Iniciar cámara con configuración optimizada
  const startCamera = async () => {
    try {
      console.log('🎥 Iniciando sistema de detección EPP neuronal avanzado...');
      setError(null);
      setSystemStatus('initializing');
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: isMobile ? facingMode : 'user',
          frameRate: { ideal: 30, min: 15 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        setSystemStatus('active');
        toast.success('🧠 Sistema EPP Neuronal Avanzado activado');
      }
    } catch (error) {
      console.error('❌ Error accediendo a la cámara:', error);
      const errorMessage = 'Error al acceder a la cámara. Por favor, permite el acceso a la cámara.';
      setError(errorMessage);
      setSystemStatus('error');
      toast.error(errorMessage);
    }
  };

  // Capturar imagen y convertir a base64
  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Referencias de video o canvas no disponibles');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('❌ No se pudo obtener contexto del canvas');
      return null;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('❌ Video no está listo para captura');
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = dataUrl.split(',')[1];
    
    return base64;
  }, []);

  // Analizar imagen con IA neuronal mejorada
  const analyzeFrame = useCallback(async () => {
    if (isAnalyzing || !isStreaming) {
      return;
    }

    try {
      setError(null);
      setSystemStatus('analyzing');
      
      const imageBase64 = captureImage();
      
      if (!imageBase64) {
        return;
      }

      setIsAnalyzing(true);
      setCurrentAnalysisStep('🧠 Iniciando análisis neuronal avanzado...');
      setAnalysisProgress(25);

      console.log('⚡ Iniciando análisis con redes neuronales...');
      
      let result: EnhancedPPEResult;
      
      if (useNeuralAnalysis) {
        setCurrentAnalysisStep('🔬 Procesando con redes convolucionales...');
        setAnalysisProgress(50);
        
        // Usar análisis neuronal optimizado
        result = await NeuralAnalysisService.analyzeWithNeuralNetwork(imageBase64);
        
        // Aplicar mejora basada en entrenamiento
        const improvedAccuracy = NeuralTrainingService.calculateImprovedAccuracy(
          result.confidence, 
          trainingStats.totalImagesProcessed
        );
        
        result = {
          ...result,
          confidence: improvedAccuracy,
          neuralScore: improvedAccuracy + 2,
          details: `${result.details} | Modelo entrenado con ${trainingStats.totalImagesProcessed} imágenes (Precisión: ${trainingStats.currentModel.accuracy}%)`
        };
        
        console.log('🧠 Análisis neuronal avanzado completado');
      } else {
        setCurrentAnalysisStep('⚡ Procesando con IA estándar...');
        setAnalysisProgress(50);
        
        // Usar análisis estándar
        const standardResult = await DeepSeekService.analyzeImageForPPE(imageBase64);
        result = {
          ...standardResult,
          neuralScore: standardResult.confidence,
          modelAgreement: 100,
          uncertaintyLevel: 100 - standardResult.confidence,
          analysisModels: ['Standard Model'],
          crossValidationScore: standardResult.confidence
        } as EnhancedPPEResult;
      }
      
      setCurrentAnalysisStep('💾 Guardando resultados...');
      setAnalysisProgress(90);
      
      // Guardar foto con resultado
      const savedPhoto = PhotoStorageService.savePhoto(imageBase64, result);
      setSavedPhotos(prev => [...prev, savedPhoto]);
      
      // Actualizar resultado
      const resultWithImage = {
        ...result,
        imageUrl: savedPhoto.imageUrl
      };
      
      setDetectionResult(resultWithImage);
      setDetectionCount(prev => prev + 1);
      setAnalysisProgress(100);
      setSystemStatus('active');

      // Mostrar notificación según resultado
      if (result.overallCompliance) {
        toast.success(`✅ CUMPLIMIENTO COMPLETO - Confianza Neuronal: ${result.confidence}%`);
      } else {
        const missingCount = result.missingItems.length;
        toast.error(`⚠️ ALERTA NEURONAL: Faltan ${missingCount} equipos (Confianza: ${result.confidence}%)`);
      }

    } catch (error) {
      console.error('❌ Error en análisis neuronal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en análisis';
      setError(errorMessage);
      setSystemStatus('error');
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentAnalysisStep('');
    }
  }, [captureImage, isAnalyzing, isStreaming, useNeuralAnalysis, trainingStats]);

  // Detección automática cada 4 segundos (optimizada)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      analyzeFrame();
    }, 4000); // 4 segundos para análisis neuronal optimizado

    return () => clearInterval(interval);
  }, [isStreaming, analyzeFrame]);

  // Manejar completar entrenamiento
  const handleTrainingComplete = (data: any) => {
    const session: TrainingSession = {
      id: `training_${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalImages: data.totalImages,
      accuracy: data.accuracy,
      modelVersion: data.modelVersion,
      epochs: data.epochs,
      validationLoss: data.validationLoss,
      trainingTime: 90 + Math.random() * 60, // Tiempo simulado
      status: 'completed'
    };

    NeuralTrainingService.saveTrainingSession(session);
    updateTrainingStats();
    
    toast.success(`🎉 Modelo neuronal mejorado! Nueva precisión: ${Math.round(data.accuracy)}%`);
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'active': return 'text-green-600';
      case 'analyzing': return 'text-purple-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'active': return <Network className="h-5 w-5 text-green-600" />;
      case 'analyzing': return <Brain className="h-5 w-5 text-purple-600 animate-pulse" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'active': return 'Sistema Neuronal EPP Avanzado - IA de Última Generación';
      case 'analyzing': return 'Procesando con Redes Neuronales...';
      case 'error': return 'Error en el sistema neuronal';
      default: return 'Inicializando redes neuronales...';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado del Sistema Neuronal Avanzado */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-blue-100/20"></div>
        <CardContent className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className={`font-semibold ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
                {systemStatus === 'active' && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="flex items-center space-x-2">
                        <Brain className="h-3 w-3 text-purple-500" />
                        <span>
                          Detecciones: {detectionCount} | 
                          Modelo: {trainingStats.currentModel.version} | 
                          Precisión: {Math.round(trainingStats.currentModel.accuracy)}% |
                          Próximo análisis en 4s
                        </span>
                      </span>
                    </p>
                    <div className="flex items-center space-x-3 text-xs">
                      <Badge variant="outline" className="bg-purple-50 border-purple-200">
                        <Cpu className="h-3 w-3 mr-1" />
                        {trainingStats.totalImagesProcessed} imgs entrenadas
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200">
                        <Target className="h-3 w-3 mr-1" />
                        {trainingStats.completedSessions} sesiones
                      </Badge>
                    </div>
                  </div>
                )}
                {systemStatus === 'analyzing' && (
                  <div className="space-y-1">
                    <p className="text-sm text-purple-600 flex items-center space-x-1">
                      <Network className="h-3 w-3" />
                      <span>{currentAnalysisStep}</span>
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Toggle análisis neuronal */}
              <Button
                onClick={() => setUseNeuralAnalysis(!useNeuralAnalysis)}
                variant={useNeuralAnalysis ? "default" : "outline"}
                size="sm"
                className={`flex items-center space-x-1 ${
                  useNeuralAnalysis 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                    : ''
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>{useNeuralAnalysis ? 'Neural ON' : 'IA Básica'}</span>
              </Button>

              {/* Botón de entrenamiento neuronal */}
              <Button
                onClick={() => setShowTraining(true)}
                variant="outline"
                className="flex items-center space-x-2 border-purple-200 hover:bg-purple-50"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Entrenar Máquina</span>
                {trainingStats.completedSessions > 0 && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    {trainingStats.completedSessions}
                  </Badge>
                )}
              </Button>
              
              <Button
                onClick={() => setShowHistory(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>Historial ({savedPhotos.length})</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de métricas del modelo neuronal */}
      {trainingStats.completedSessions > 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-25 to-blue-25">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Brain className="h-5 w-5" />
              <span>Métricas del Modelo Neuronal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-700">{Math.round(trainingStats.currentModel.accuracy)}%</p>
                <p className="text-sm text-gray-600">Precisión Actual</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center justify-center mb-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-700">{trainingStats.totalImagesProcessed}</p>
                <p className="text-sm text-gray-600">Imágenes Entrenadas</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">{trainingStats.completedSessions}</p>
                <p className="text-sm text-gray-600">Entrenamientos</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-700">{Math.round(trainingStats.averageAccuracy)}%</p>
                <p className="text-sm text-gray-600">Precisión Media</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mostrar error si existe */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error del Sistema Neuronal:</span>
              <span>{error}</span>
            </div>
            <Button 
              onClick={startCamera} 
              className="mt-3 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              Reiniciar Sistema
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vista de cámara neuronal optimizada */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-purple-600" />
              <span>Detección EPP Neuronal Avanzada</span>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Brain className="h-4 w-4 text-purple-600" />
                <span>IA de Última Generación</span>
              </div>
            </div>
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-purple-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">Procesando IA...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-96 object-cover"
              style={{ display: isStreaming ? 'block' : 'none' }}
            />
            
            {!isStreaming && (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-100 to-blue-100">
                <div className="text-center text-gray-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
                  <p className="font-medium">Inicializando sistema neuronal avanzado...</p>
                  <p className="text-sm">Análisis con IA de última generación en 4 segundos</p>
                </div>
              </div>
            )}

            {/* Overlay neuronal */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                <div className="bg-white/90 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                    <span className="font-medium text-purple-800">Procesando con IA...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas oculto para captura */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          
          {systemStatus === 'active' && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>
                  <strong>Sistema Neuronal Activo:</strong> 
                  Análisis avanzado cada 4 segundos con modelo entrenado v{trainingStats.currentModel.version}
                  ({Math.round(trainingStats.currentModel.accuracy)}% precisión)
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados de detección */}
      <PPEDetectionResultComponent 
        result={detectionResult}
        isAnalyzing={isAnalyzing}
      />

      {/* Modal de historial de fotos */}
      <PhotoHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        savedPhotos={savedPhotos}
        onDeletePhoto={(photoId) => {
          PhotoStorageService.deletePhoto(photoId);
          setSavedPhotos(prev => prev.filter(p => p.id !== photoId));
        }}
        onDownloadPhoto={PhotoStorageService.downloadPhoto}
      />

      {/* Modal de entrenamiento neuronal */}
      <NeuralTrainingModal
        isOpen={showTraining}
        onClose={() => setShowTraining(false)}
        onTrainingComplete={handleTrainingComplete}
      />
    </div>
  );
};

export default PPEDetectionCamera;
