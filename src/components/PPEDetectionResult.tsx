import React from 'react';
import { PPEDetectionResult } from '../services/deepseekService';
import { EnhancedPPEResult } from '../services/neuralAnalysisService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, Camera, Brain, Network, Cpu, Target } from 'lucide-react';

interface PPEDetectionResultProps {
  result: EnhancedPPEResult | PPEDetectionResult | null;
  isAnalyzing: boolean;
}

const PPEDetectionResultComponent: React.FC<PPEDetectionResultProps> = ({ result, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-lg">Procesando con redes neuronales...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  // Verificar si es resultado neuronal mejorado
  const isEnhancedResult = 'neuralScore' in result;
  const enhancedResult = result as EnhancedPPEResult;

  const ppeItems = [
    { key: 'hasHelmet', label: 'Casco de Seguridad', emoji: '⛑️', value: result.hasHelmet },
    { key: 'hasGloves', label: 'Guantes de Protección', emoji: '🧤', value: result.hasGloves },
    { key: 'hasSafetyGlasses', label: 'Gafas de Seguridad', emoji: '🥽', value: result.hasSafetyGlasses },
    { key: 'hasMask', label: 'Mascarilla/Respirador', emoji: '😷', value: result.hasMask },
    { key: 'hasVest', label: 'Chaleco de Seguridad', emoji: '🦺', value: result.hasVest },
  ];

  const complianceColor = result.overallCompliance ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  const complianceIcon = result.overallCompliance ? 
    <CheckCircle className="h-6 w-6 text-green-600" /> : 
    <XCircle className="h-6 w-6 text-red-600" />;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour12: false })
    };
  };

  const { date, time } = formatTimestamp(result.timestamp);

  return (
    <div className="mt-6 space-y-4">
      {/* Estado General de Cumplimiento con métricas neuronales */}
      <Card className={`border-2 ${complianceColor} ${isEnhancedResult ? 'bg-gradient-to-r from-purple-25 to-blue-25' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            {complianceIcon}
            <span>
              {result.overallCompliance ? 'CUMPLIMIENTO COMPLETO' : 'INCUMPLIMIENTO DETECTADO'}
            </span>
            {isEnhancedResult && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Network className="h-4 w-4" />
                <span className="text-sm">Neural</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{date} - {time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Camera className="h-4 w-4" />
              <span>Foto guardada automáticamente</span>
            </div>
            {isEnhancedResult && (
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-purple-600">Análisis Multi-Modelo</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Confianza:</span>
                <Badge variant="outline" className="text-sm">
                  {result.confidence}%
                </Badge>
              </div>
              {isEnhancedResult && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-purple-700">Score Neuronal:</span>
                  <Badge variant="outline" className="text-sm border-purple-300">
                    {enhancedResult.neuralScore}%
                  </Badge>
                </div>
              )}
            </div>
            {result.missingItems.length > 0 && (
              <Badge variant="destructive" className="text-sm">
                {result.missingItems.length} elementos faltantes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Panel de métricas neuronales detalladas */}
      {isEnhancedResult && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Network className="h-5 w-5" />
              <span>Métricas de Análisis Neuronal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-700">{enhancedResult.neuralScore}%</p>
                <p className="text-sm text-gray-600">Score Neuronal</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center justify-center mb-2">
                  <Network className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-700">{enhancedResult.modelAgreement}%</p>
                <p className="text-sm text-gray-600">Acuerdo Modelos</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">{enhancedResult.crossValidationScore}%</p>
                <p className="text-sm text-gray-600">Validación Cruzada</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-700">{enhancedResult.uncertaintyLevel}%</p>
                <p className="text-sm text-gray-600">Incertidumbre</p>
              </div>
            </div>
            
            {/* Información de modelos utilizados */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Modelos Neuronales Utilizados:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {enhancedResult.analysisModels.map((model, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elementos faltantes destacados */}
      {result.missingItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <span>Elementos de Protección Faltantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingItems.map((item, index) => (
                <Badge key={index} variant="destructive" className="text-sm">
                  ⚠️ {item}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-orange-700 mt-2">
              Por favor, asegúrese de usar todos los equipos de protección requeridos antes de continuar.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detalle de cada EPP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span>Detalle de Equipos de Protección</span>
            {isEnhancedResult && (
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                Análisis Neuronal
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ppeItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.value ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Badge className="bg-green-600 text-white">Detectado</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <Badge variant="destructive">Faltante</Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalles del análisis */}
      {result.details && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>
                {isEnhancedResult ? 'Análisis Detallado de Redes Neuronales' : 'Análisis Detallado de IA'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{result.details}</p>
            {isEnhancedResult && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Tecnología:</strong> Este análisis fue realizado utilizando múltiples redes neuronales 
                  con validación cruzada para garantizar la máxima precisión en la detección de EPP.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PPEDetectionResultComponent;
