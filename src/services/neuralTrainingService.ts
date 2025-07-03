
import { TrainingImageStorageService } from './trainingImageStorageService';

export interface TrainingSession {
  id: string;
  timestamp: string;
  totalImages: number;
  accuracy: number;
  modelVersion: string;
  epochs: number;
  validationLoss: number;
  trainingTime: number;
  status: 'completed' | 'failed' | 'in_progress';
  folderId?: string;
  storedImages?: number;
}

export interface NeuralModel {
  version: string;
  accuracy: number;
  trainedImages: number;
  lastTraining: string;
  parameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    layers: number;
  };
}

export class NeuralTrainingService {
  private static readonly STORAGE_KEY = 'neural_training_sessions';
  private static readonly MODEL_KEY = 'current_neural_model';

  // Obtener todas las sesiones de entrenamiento
  static getTrainingSessions(): TrainingSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Guardar sesión de entrenamiento
  static saveTrainingSession(session: TrainingSession): void {
    const sessions = this.getTrainingSessions();
    sessions.unshift(session); // Añadir al principio
    
    // Mantener solo las últimas 20 sesiones
    const limitedSessions = sessions.slice(0, 20);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedSessions));
    
    // Actualizar modelo actual
    this.updateCurrentModel(session);
    
    console.log('💾 Sesión de entrenamiento guardada:', session.id);
  }

  // Actualizar modelo actual basado en la sesión de entrenamiento
  private static updateCurrentModel(session: TrainingSession): void {
    const currentModel = this.getCurrentModel();
    
    const updatedModel: NeuralModel = {
      version: session.modelVersion,
      accuracy: Math.max(currentModel.accuracy, session.accuracy),
      trainedImages: currentModel.trainedImages + session.totalImages,
      lastTraining: session.timestamp,
      parameters: {
        learningRate: 0.001,
        batchSize: 32,
        epochs: session.epochs,
        layers: 8
      }
    };

    localStorage.setItem(this.MODEL_KEY, JSON.stringify(updatedModel));
    console.log('🧠 Modelo neuronal actualizado:', updatedModel.version);
  }

  // Obtener modelo actual
  static getCurrentModel(): NeuralModel {
    const stored = localStorage.getItem(this.MODEL_KEY);
    
    if (stored) {
      return JSON.parse(stored);
    }

    // Modelo por defecto
    const defaultModel: NeuralModel = {
      version: 'v1.0.0',
      accuracy: 85,
      trainedImages: 0,
      lastTraining: new Date().toISOString(),
      parameters: {
        learningRate: 0.001,
        batchSize: 32,
        epochs: 10,
        layers: 6
      }
    };

    localStorage.setItem(this.MODEL_KEY, JSON.stringify(defaultModel));
    return defaultModel;
  }

  // Obtener estadísticas de entrenamiento mejoradas
  static getTrainingStats() {
    const sessions = this.getTrainingSessions();
    const model = this.getCurrentModel();
    const trainingImageStats = TrainingImageStorageService.getTrainingStats();
    
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalTrainingTime = completedSessions.reduce((sum, s) => sum + s.trainingTime, 0);
    const averageAccuracy = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + s.accuracy, 0) / completedSessions.length 
      : 0;

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalTrainingTime: Math.round(totalTrainingTime),
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      currentModel: model,
      lastTraining: sessions[0]?.timestamp || null,
      totalImagesProcessed: model.trainedImages + trainingImageStats.totalImages,
      storedTrainingImages: trainingImageStats.totalImages,
      trainingFolders: trainingImageStats.totalFolders,
      highQualityImages: trainingImageStats.highQualityImages,
      modelEvolution: sessions.slice(0, 5).map(s => ({
        version: s.modelVersion,
        accuracy: s.accuracy,
        date: s.timestamp,
        storedImages: s.storedImages || 0
      }))
    };
  }

  // Limpiar datos de entrenamiento
  static clearTrainingData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.MODEL_KEY);
    console.log('🗑️ Datos de entrenamiento limpiados');
  }

  static exportTrainingData() {
    const sessions = this.getTrainingSessions();
    const model = this.getCurrentModel();
    const stats = this.getTrainingStats();
    const trainingImages = TrainingImageStorageService.getAllTrainingImages();
    const folders = TrainingImageStorageService.getAllFolders();

    const exportData = {
      sessions,
      model,
      stats,
      trainingImages: trainingImages.length,
      folders,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural_training_complete_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📁 Datos completos de entrenamiento exportados');
  }

  // Simular mejora de precisión basada en entrenamiento + imágenes almacenadas
  static calculateImprovedAccuracy(baseAccuracy: number, additionalImages: number): number {
    const model = this.getCurrentModel();
    const storedImages = TrainingImageStorageService.getAllTrainingImages();
    const totalTrainingData = model.trainedImages + storedImages.length + additionalImages;
    
    const improvementFactor = Math.min(0.2, totalTrainingData / 1000 * 0.12);
    const qualityBonus = storedImages.length > 0 ? 0.03 : 0;
    const improvedAccuracy = Math.min(99, baseAccuracy + (improvementFactor + qualityBonus) * 100);
    
    return Math.round(improvedAccuracy * 100) / 100;
  }

  // Verificar si el modelo necesita reentrenamiento
  static needsRetraining(): boolean {
    const model = this.getCurrentModel();
    const storedImages = TrainingImageStorageService.getAllTrainingImages();
    const lastTraining = new Date(model.lastTraining);
    const daysSinceTraining = (Date.now() - lastTraining.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceTraining > 7 || (model.trainedImages + storedImages.length) < 50;
  }

  // Obtener recomendaciones de entrenamiento mejoradas
  static getTrainingRecommendations(): string[] {
    const model = this.getCurrentModel();
    const storedImages = TrainingImageStorageService.getAllTrainingImages();
    const trainingStats = TrainingImageStorageService.getTrainingStats();
    const totalImages = model.trainedImages + storedImages.length;
    const recommendations: string[] = [];

    if (totalImages < 50) {
      recommendations.push(`🎯 Añade más imágenes de entrenamiento (${totalImages}/50 mínimo recomendado)`);
    }

    if (model.accuracy < 90) {
      recommendations.push('📈 El modelo necesita más entrenamiento para alcanzar alta precisión');
    }

    if (this.needsRetraining()) {
      recommendations.push('🔄 Considera reentrenar el modelo con datos más recientes');
    }

    if (trainingStats.highQualityImages < trainingStats.totalImages * 0.7) {
      recommendations.push('📸 Mejora la calidad de las imágenes de entrenamiento (usa imágenes más grandes)');
    }

    if (storedImages.length > 0) {
      recommendations.push(`💾 Tienes ${storedImages.length} imágenes almacenadas mejorando las predicciones`);
    }

    if (totalImages > 100 && model.accuracy > 95) {
      recommendations.push('✅ El modelo está bien entrenado y optimizado para uso en producción');
    }

    return recommendations.length > 0 ? recommendations : ['🎉 El modelo está funcionando correctamente'];
  }
}
