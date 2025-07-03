import React from 'react';
import { PPEDetectionResult } from '../services/deepseekService';
import { EnhancedPPEResult } from '../services/neuralAnalysisService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, Camera, Brain, Network, Cpu, Target, AlertTriangle } from 'lucide-react';

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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gradient-to-r from-purple-500 to-pink-500"></div>
            <span className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              Procesando con redes neuronales...
            </span>
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

  const complianceColor = result.overallCompliance ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-400' : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400';
  const complianceIcon = result.overallCompliance ? 
    <CheckCircle className="h-6 w-6 text-emerald-500" /> : 
    <XCircle className="h-6 w-6 text-red-500" />;

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
      <Card className={`border-2 ${complianceColor} ${isEnhancedResult ? 'bg-gradient-to-r from-purple-50 to-cyan-50' : ''} shadow-xl`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            {complianceIcon}
            <span className={result.overallCompliance ? 'text-emerald-700' : 'text-red-700'}>
              {result.overallCompliance ? 'CUMPLIMIENTO COMPLETO' : 'INCUMPLIMIENTO DETECTADO'}
            </span>
            {isEnhancedResult && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Network className="h-4 w-4" />
                <span className="text-sm font-bold">Neural</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-cyan-500" />
              <span className="text-cyan-700">{date} - {time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Camera className="h-4 w-4 text-purple-500" />
              <span className="text-purple-700">Foto guardada automáticamente</span>
            </div>
            {isEnhancedResult && (
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4 text-pink-600" />
                <span className="text-pink-700 font-semibold">Análisis Multi-Modelo</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-700">Confianza:</span>
                <Badge variant="outline" className="text-sm border-blue-400 text-blue-700 bg-blue-50">
                  {result.confidence}%
                </Badge>
              </div>
              {isEnhancedResult && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-purple-700">Score Neuronal:</span>
                  <Badge variant="outline" className="text-sm border-purple-400 text-purple-700 bg-purple-50">
                    {enhancedResult.neuralScore}%
                  </Badge>
                </div>
              )}
            </div>
            {result.missingItems.length > 0 && (
              <Badge variant="destructive" className="text-sm bg-gradient-to-r from-red-500 to-pink-500">
                {result.missingItems.length} elementos faltantes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Panel de métricas neuronales detalladas */}
      {isEnhancedResult && (
        <Card className="border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-cyan-50 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Network className="h-5 w-5" />
              <span>Métricas de Análisis Neuronal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border border-purple-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-700">{enhancedResult.neuralScore}%</p>
                <p className="text-sm text-purple-600">Score Neuronal</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg border border-cyan-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-2">
                  <Network className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-2xl font-bold text-cyan-700">{enhancedResult.modelAgreement}%</p>
                <p className="text-sm text-cyan-600">Acuerdo Modelos</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg border border-emerald-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-700">{enhancedResult.crossValidationScore}%</p>
                <p className="text-sm text-emerald-600">Validación Cruzada</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg border border-orange-300 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-700">{enhancedResult.uncertaintyLevel}%</p>
                <p className="text-sm text-orange-600">Incertidumbre</p>
              </div>
            </div>
            
            {/* Información de modelos utilizados */}
            <div className="mt-4 p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Modelos Neuronales Utilizados:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {enhancedResult.analysisModels.map((model, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-pink-300 text-pink-700 bg-pink-50">
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
        <Card className="border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Elementos de Protección Faltantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingItems.map((item, index) => (
                <Badge key={index} variant="destructive" className="text-sm bg-gradient-to-r from-red-500 to-pink-500">
                  ⚠️ {item}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-orange-700 mt-2 font-medium">
              Por favor, asegúrese de usar todos los equipos de protección requeridos antes de continuar.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detalle de cada EPP */}
      <Card className="shadow-xl border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">Detalle de Equipos de Protección</span>
            {isEnhancedResult && (
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50">
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
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  item.value ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-md' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-md'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium text-gray-800">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.value ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">Detectado</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-500">Faltante</Badge>
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
        <Card className="shadow-xl border-purple-200 bg-gradient-to-r from-purple-25 to-pink-25">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800">
                {isEnhancedResult ? 'Análisis Detallado de Redes Neuronales' : 'Análisis Detallado de IA'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{result.details}</p>
            {isEnhancedResult && (
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-300">
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
