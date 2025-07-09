
export interface TrainingImageData {
  id: string;
  fileName: string;
  imageData: string; // base64
  imageUrl: string;
  labels: {
    hasHelmet: boolean;
    hasGloves: boolean;
    hasSafetyGlasses: boolean;
    hasMask: boolean;
    hasVest: boolean;
  };
  uploadDate: string;
  trainingSessionId?: string;
  isUsedForPrediction: boolean;
  quality: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface TrainingImageFolder {
  id: string;
  name: string;
  description: string;
  images: TrainingImageData[];
  createdDate: string;
  totalImages: number;
  avgQuality: number;
  avgConfidence: number;
}

export class TrainingImageStorageService {
  private static readonly STORAGE_KEY = 'training_images_storage';
  private static readonly FOLDERS_KEY = 'training_folders';

  // Crear carpeta de entrenamiento
  static createTrainingFolder(name: string, description: string = ''): TrainingImageFolder {
    const folder: TrainingImageFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      images: [],
      createdDate: new Date().toISOString(),
      totalImages: 0,
      avgQuality: 0,
      avgConfidence: 0
    };

    const folders = this.getAllFolders();
    folders.push(folder);
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    
    console.log('📁 Carpeta de entrenamiento creada:', folder.name);
    return folder;
  }

  // Guardar imagen de entrenamiento en carpeta específica
  static saveTrainingImage(
    file: File, 
    labels: TrainingImageData['labels'],
    folderId?: string,
    trainingSessionId?: string
  ): Promise<TrainingImageData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const imageData = reader.result as string;
          const base64 = imageData.split(',')[1];
          
          const trainingImage: TrainingImageData = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fileName: file.name,
            imageData: base64,
            imageUrl: imageData,
            labels,
            uploadDate: new Date().toISOString(),
            trainingSessionId,
            isUsedForPrediction: true,
            quality: this.assessImageQuality(file),
            confidence: this.calculateImageConfidence(labels)
          };

          // Guardar en carpeta específica o crear carpeta por defecto
          let targetFolderId = folderId;
          if (!targetFolderId) {
            const defaultFolder = this.getOrCreateDefaultFolder();
            targetFolderId = defaultFolder.id;
          }

          this.addImageToFolder(targetFolderId, trainingImage);
          
          console.log('🖼️ Imagen de entrenamiento guardada en carpeta:', trainingImage.fileName);
          resolve(trainingImage);
        } catch (error) {
          console.error('❌ Error guardando imagen de entrenamiento:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo de imagen'));
      };

      reader.readAsDataURL(file);
    });
  }

  // Obtener todas las carpetas
  static getAllFolders(): TrainingImageFolder[] {
    const stored = localStorage.getItem(this.FOLDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Obtener carpeta por ID
  static getFolderById(folderId: string): TrainingImageFolder | null {
    const folders = this.getAllFolders();
    return folders.find(folder => folder.id === folderId) || null;
  }

  // Obtener o crear carpeta por defecto
  static getOrCreateDefaultFolder(): TrainingImageFolder {
    let folders = this.getAllFolders();
    let defaultFolder = folders.find(f => f.name === 'Entrenamiento General');
    
    if (!defaultFolder) {
      defaultFolder = this.createTrainingFolder(
        'Entrenamiento General', 
        'Carpeta principal para imágenes de entrenamiento EPP'
      );
    }
    
    return defaultFolder;
  }

  // Añadir imagen a carpeta
  static addImageToFolder(folderId: string, image: TrainingImageData): void {
    const folders = this.getAllFolders();
    const folderIndex = folders.findIndex(f => f.id === folderId);
    
    if (folderIndex !== -1) {
      folders[folderIndex].images.push(image);
      folders[folderIndex].totalImages = folders[folderIndex].images.length;
      folders[folderIndex].avgQuality = this.calculateAverageQuality(folders[folderIndex].images);
      folders[folderIndex].avgConfidence = this.calculateAverageConfidence(folders[folderIndex].images);
      
      localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
      console.log('✅ Imagen añadida a carpeta:', folders[folderIndex].name);
    }
  }

  // Obtener todas las imágenes de entrenamiento para predicción rápida
  static getAllTrainingImages(): TrainingImageData[] {
    const folders = this.getAllFolders();
    return folders.flatMap(folder => folder.images);
  }

  // Obtener imágenes de alta calidad para predicción optimizada
  static getHighQualityImagesForPrediction(): TrainingImageData[] {
    const allImages = this.getAllTrainingImages();
    return allImages
      .filter(img => img.isUsedForPrediction && img.quality === 'high')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 50); // Limitar a las 50 mejores para velocidad
  }

  // Evaluar calidad de imagen
  private static assessImageQuality(file: File): 'high' | 'medium' | 'low' {
    const sizeInMB = file.size / (1024 * 1024);
    
    if (sizeInMB > 2) return 'high';
    if (sizeInMB > 0.5) return 'medium';
    return 'low';
  }

  // Calcular confianza de imagen basada en etiquetas
  private static calculateImageConfidence(labels: TrainingImageData['labels']): number {
    const labelCount = Object.values(labels).filter(Boolean).length;
    return Math.min(95, 70 + (labelCount * 5)); // Base 70% + 5% por cada EPP detectado
  }

  // Calcular calidad promedio
  private static calculateAverageQuality(images: TrainingImageData[]): number {
    if (images.length === 0) return 0;
    
    const qualityScores = images.map(img => {
      switch (img.quality) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 1;
      }
    });
    
    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }

  // Calcular confianza promedio
  private static calculateAverageConfidence(images: TrainingImageData[]): number {
    if (images.length === 0) return 0;
    return images.reduce((sum, img) => sum + img.confidence, 0) / images.length;
  }

  // Obtener estadísticas de entrenamiento optimizadas
  static getTrainingStats() {
    const folders = this.getAllFolders();
    const allImages = this.getAllTrainingImages();
    const highQualityImages = allImages.filter(img => img.quality === 'high');
    
    const stats = {
      totalFolders: folders.length,
      totalImages: allImages.length,
      highQualityImages: highQualityImages.length,
      mediumQualityImages: allImages.filter(img => img.quality === 'medium').length,
      lowQualityImages: allImages.filter(img => img.quality === 'low').length,
      imagesWithHelmet: allImages.filter(img => img.labels.hasHelmet).length,
      imagesWithGloves: allImages.filter(img => img.labels.hasGloves).length,
      imagesWithGlasses: allImages.filter(img => img.labels.hasSafetyGlasses).length,
      imagesWithMask: allImages.filter(img => img.labels.hasMask).length,
      imagesWithVest: allImages.filter(img => img.labels.hasVest).length,
      avgQualityScore: folders.reduce((sum, folder) => sum + folder.avgQuality, 0) / folders.length || 0,
      avgConfidenceScore: folders.reduce((sum, folder) => sum + folder.avgConfidence, 0) / folders.length || 0,
      readyForPrediction: highQualityImages.length >= 10
    };
    
    return stats;
  }

  // Mejorar predicción con datos de entrenamiento - OPTIMIZADO PARA VELOCIDAD
  static enhancePredictionWithTrainingData(basePrediction: any): any {
    const trainingImages = this.getHighQualityImagesForPrediction();
    const stats = this.getTrainingStats();
    
    if (trainingImages.length === 0) {
      return basePrediction;
    }

    // Mejora rápida basada en coincidencias de patrones
    const patternMatch = this.findPatternMatches(basePrediction, trainingImages);
    const improvementFactor = Math.min(0.25, (trainingImages.length / 50) * 0.2);
    const confidenceBoost = patternMatch * 10 + (stats.avgConfidenceScore / 100) * 5;
    
    const enhancedPrediction = {
      ...basePrediction,
      confidence: Math.min(98, basePrediction.confidence + confidenceBoost),
      details: `${basePrediction.details} | OPTIMIZADO: ${trainingImages.length} imgs alta calidad (Patrón: ${Math.round(patternMatch * 100)}%)`,
      trainingDataUsed: true,
      trainingImagesCount: trainingImages.length,
      avgTrainingQuality: stats.avgQualityScore,
      patternMatchScore: patternMatch,
      optimizedForSpeed: true
    };

    console.log(`🚀 Predicción mejorada con ${trainingImages.length} imágenes de entrenamiento`);
    return enhancedPrediction;
  }

  // Encontrar coincidencias de patrones para mejora rápida
  private static findPatternMatches(prediction: any, trainingImages: TrainingImageData[]): number {
    if (!prediction.detectedItems) return 0.5;
    
    let matches = 0;
    let total = 0;
    
    trainingImages.slice(0, 20).forEach(img => { // Solo revisar las primeras 20 para velocidad
      Object.keys(img.labels).forEach(key => {
        total++;
        const detected = prediction.detectedItems.some((item: any) => 
          item.type.toLowerCase().includes(key.replace('has', '').toLowerCase())
        );
        if (detected === img.labels[key as keyof typeof img.labels]) {
          matches++;
        }
      });
    });
    
    return total > 0 ? matches / total : 0.5;
  }

  // Eliminar imagen de entrenamiento
  static deleteTrainingImage(imageId: string): void {
    const folders = this.getAllFolders();
    
    folders.forEach(folder => {
      const imageIndex = folder.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        folder.images.splice(imageIndex, 1);
        folder.totalImages = folder.images.length;
        folder.avgQuality = this.calculateAverageQuality(folder.images);
        folder.avgConfidence = this.calculateAverageConfidence(folder.images);
      }
    });
    
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    console.log('🗑️ Imagen de entrenamiento eliminada:', imageId);
  }

  // Eliminar carpeta completa
  static deleteFolder(folderId: string): void {
    const folders = this.getAllFolders();
    const filteredFolders = folders.filter(folder => folder.id !== folderId);
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(filteredFolders));
    console.log('📁🗑️ Carpeta de entrenamiento eliminada:', folderId);
  }

  // Exportar datos de entrenamiento
  static exportTrainingData(): void {
    const folders = this.getAllFolders();
    const stats = this.getTrainingStats();
    
    const exportData = {
      folders,
      stats,
      exportDate: new Date().toISOString(),
      version: '2.0',
      totalSize: folders.reduce((sum, folder) => sum + folder.images.length, 0)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_images_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📁💾 Datos de imágenes de entrenamiento exportados');
  }

  // Limpiar todos los datos de entrenamiento
  static clearAllTrainingData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.FOLDERS_KEY);
    console.log('🗑️ Todos los datos de entrenamiento eliminados');
  }
}
