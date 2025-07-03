
import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Brain, Upload, X, CheckCircle, AlertCircle, Zap, Network, Cpu, Target } from 'lucide-react';
import { toast } from 'sonner';

interface TrainingImage {
  id: string;
  file: File;
  preview: string;
  labels: {
    hasHelmet: boolean;
    hasGloves: boolean;
    hasSafetyGlasses: boolean;
    hasMask: boolean;
    hasVest: boolean;
  };
  status: 'pending' | 'processed' | 'error';
}

interface NeuralTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrainingComplete: (trainingData: any) => void;
}

const NeuralTrainingModal: React.FC<NeuralTrainingModalProps> = ({
  isOpen,
  onClose,
  onTrainingComplete
}) => {
  const [trainingImages, setTrainingImages] = useState<TrainingImage[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const id = Date.now() + Math.random();
      const preview = URL.createObjectURL(file);
      
      const newImage: TrainingImage = {
        id: id.toString(),
        file,
        preview,
        labels: {
          hasHelmet: false,
          hasGloves: false,
          hasSafetyGlasses: false,
          hasMask: false,
          hasVest: false
        },
        status: 'pending'
      };

      setTrainingImages(prev => [...prev, newImage]);
    });

    toast.success(`📸 ${imageFiles.length} imágenes añadidas para entrenamiento`);
  };

  const updateImageLabels = (imageId: string, labels: Partial<TrainingImage['labels']>) => {
    setTrainingImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, labels: { ...img.labels, ...labels } }
          : img
      )
    );
  };

  const removeImage = (imageId: string) => {
    setTrainingImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const startNeuralTraining = async () => {
    if (trainingImages.length === 0) {
      toast.error('⚠️ Añade al menos una imagen para entrenar');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    
    try {
      // Simular proceso de entrenamiento neuronal
      const steps = [
        '🔬 Analizando características de imágenes...',
        '🧠 Entrenando redes neuronales convolucionales...',
        '⚡ Optimizando pesos sinápticos...',
        '🎯 Validando precisión del modelo...',
        '💾 Guardando modelo entrenado...',
        '✅ Entrenamiento completado exitosamente'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setTrainingProgress((i + 1) / steps.length * 100);
        
        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Marcar imágenes como procesadas
        if (i === 2) {
          setTrainingImages(prev => 
            prev.map(img => ({ ...img, status: 'processed' as const }))
          );
        }
      }

      // Crear datos de entrenamiento
      const trainingData = {
        totalImages: trainingImages.length,
        timestamp: new Date().toISOString(),
        accuracy: 95 + Math.random() * 4, // Simular alta precisión
        modelVersion: `v${Date.now()}`,
        epochs: 50,
        validationLoss: 0.05 + Math.random() * 0.03
      };

      onTrainingComplete(trainingData);
      toast.success('🎉 Entrenamiento neuronal completado con éxito');
      
      // Limpiar imágenes después del entrenamiento
      setTimeout(() => {
        setTrainingImages([]);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error en entrenamiento:', error);
      toast.error('❌ Error durante el entrenamiento neuronal');
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
      setCurrentStep('');
    }
  };

  const eppOptions = [
    { key: 'hasHelmet', label: 'Casco', emoji: '⛑️', color: 'blue' },
    { key: 'hasGloves', label: 'Guantes', emoji: '🧤', color: 'green' },
    { key: 'hasSafetyGlasses', label: 'Gafas', emoji: '🥽', color: 'yellow' },
    { key: 'hasMask', label: 'Mascarilla', emoji: '😷', color: 'purple' },
    { key: 'hasVest', label: 'Chaleco', emoji: '🦺', color: 'orange' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Entrenamiento de Redes Neuronales
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado del entrenamiento */}
          {isTraining && (
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <span className="font-medium text-purple-800">{currentStep}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Progreso: {Math.round(trainingProgress)}% - Entrenando con {trainingImages.length} imágenes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zona de subida de archivos */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
              <div
                className={`text-center ${dragActive ? 'bg-blue-50 border-blue-300' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Subir Imágenes de Entrenamiento</h3>
                <p className="text-gray-600 mb-4">
                  Arrastra y suelta imágenes de EPP o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                  className="hidden"
                  id="training-upload"
                />
                <label htmlFor="training-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Imágenes
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Lista de imágenes de entrenamiento */}
          {trainingImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Imágenes de Entrenamiento ({trainingImages.length})</span>
                  <Badge variant="outline" className="bg-purple-50 border-purple-200">
                    <Network className="h-3 w-3 mr-1" />
                    Datos Neuronales
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {trainingImages.map((image) => (
                    <div key={image.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <img
                          src={image.preview}
                          alt="Training"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium truncate">
                              {image.file.name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeImage(image.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Etiquetas EPP */}
                          <div className="grid grid-cols-2 gap-1">
                            {eppOptions.map((option) => (
                              <label
                                key={option.key}
                                className="flex items-center space-x-1 text-xs cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={image.labels[option.key as keyof typeof image.labels]}
                                  onChange={(e) =>
                                    updateImageLabels(image.id, {
                                      [option.key]: e.target.checked
                                    })
                                  }
                                  className="rounded"
                                />
                                <span>{option.emoji}</span>
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                          
                          {/* Estado de procesamiento */}
                          <div className="flex items-center space-x-1">
                            {image.status === 'processed' ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Procesado</span>
                              </>
                            ) : image.status === 'error' ? (
                              <>
                                <AlertCircle className="h-3 w-3 text-red-600" />
                                <span className="text-xs text-red-600">Error</span>
                              </>
                            ) : (
                              <>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                <span className="text-xs text-yellow-600">Pendiente</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controles de entrenamiento */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Precisión esperada: ~95%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cpu className="h-4 w-4" />
                <span>Modelo: CNN Avanzado</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isTraining}>
                Cancelar
              </Button>
              <Button
                onClick={startNeuralTraining}
                disabled={isTraining || trainingImages.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                {isTraining ? 'Entrenando...' : 'Iniciar Entrenamiento'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeuralTrainingModal;
