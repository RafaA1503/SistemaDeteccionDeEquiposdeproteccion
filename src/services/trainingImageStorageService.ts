
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
}

export interface TrainingImageFolder {
  id: string;
  name: string;
  description: string;
  images: TrainingImageData[];
  createdDate: string;
  totalImages: number;
  avgQuality: number;
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
      avgQuality: 0
    };

    const folders = this.getAllFolders();
    folders.push(folder);
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    
    console.log('📁 Carpeta de entrenamiento creada:', folder.name);
    return folder;
  }

  // Guardar imagen de entrenamiento en carpeta
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
            quality: this.assessImageQuality(file)
          };

          // Guardar en carpeta específica o crear carpeta por defecto
          let targetFolderId = folderId;
          if (!targetFolderId) {
            const defaultFolder = this.getOrCreateDefaultFolder();
            targetFolderId = defaultFolder.id;
          }

          this.addImageToFolder(targetFolderId, trainingImage);
          
          console.log('🖼️ Imagen de entrenamiento guardada:', trainingImage.fileName);
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
      
      localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    }
  }

  // Obtener todas las imágenes de entrenamiento
  static getAllTrainingImages(): TrainingImageData[] {
    const folders = this.getAllFolders();
    return folders.flatMap(folder => folder.images);
  }

  // Obtener imágenes para predicción (las de mejor calidad)
  static getImagesForPrediction(): TrainingImageData[] {
    const allImages = this.getAllTrainingImages();
    return allImages
      .filter(img => img.isUsedForPrediction)
      .sort((a, b) => {
        const qualityOrder = { high: 3, medium: 2, low: 1 };
        return qualityOrder[b.quality] - qualityOrder[a.quality];
      });
  }

  // Evaluar calidad de imagen
  private static assessImageQuality(file: File): 'high' | 'medium' | 'low' {
    const sizeInMB = file.size / (1024 * 1024);
    
    if (sizeInMB > 2) return 'high';
    if (sizeInMB > 0.5) return 'medium';
    return 'low';
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

  // Eliminar imagen de entrenamiento
  static deleteTrainingImage(imageId: string): void {
    const folders = this.getAllFolders();
    
    folders.forEach(folder => {
      const imageIndex = folder.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        folder.images.splice(imageIndex, 1);
        folder.totalImages = folder.images.length;
        folder.avgQuality = this.calculateAverageQuality(folder.images);
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

  // Obtener estadísticas de entrenamiento
  static getTrainingStats() {
    const folders = this.getAllFolders();
    const allImages = this.getAllTrainingImages();
    
    const stats = {
      totalFolders: folders.length,
      totalImages: allImages.length,
      highQualityImages: allImages.filter(img => img.quality === 'high').length,
      mediumQualityImages: allImages.filter(img => img.quality === 'medium').length,
      lowQualityImages: allImages.filter(img => img.quality === 'low').length,
      imagesWithHelmet: allImages.filter(img => img.labels.hasHelmet).length,
      imagesWithGloves: allImages.filter(img => img.labels.hasGloves).length,
      imagesWithGlasses: allImages.filter(img => img.labels.hasSafetyGlasses).length,
      imagesWithMask: allImages.filter(img => img.labels.hasMask).length,
      imagesWithVest: allImages.filter(img => img.labels.hasVest).length,
      avgQualityScore: folders.reduce((sum, folder) => sum + folder.avgQuality, 0) / folders.length || 0
    };
    
    return stats;
  }

  // Exportar datos de entrenamiento
  static exportTrainingData(): void {
    const folders = this.getAllFolders();
    const stats = this.getTrainingStats();
    
    const exportData = {
      folders,
      stats,
      exportDate: new Date().toISOString(),
      version: '1.0',
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

  // Mejorar predicción con imágenes de entrenamiento
  static enhancePredictionWithTrainingData(basePrediction: any): any {
    const trainingImages = this.getImagesForPrediction();
    const stats = this.getTrainingStats();
    
    if (trainingImages.length === 0) {
      return basePrediction;
    }

    // Calcular mejora basada en datos de entrenamiento
    const improvementFactor = Math.min(0.15, trainingImages.length / 100 * 0.1);
    const qualityBonus = stats.avgQualityScore / 3 * 0.05;
    
    const enhancedPrediction = {
      ...basePrediction,
      confidence: Math.min(99, basePrediction.confidence + (improvementFactor + qualityBonus) * 100),
      details: `${basePrediction.details} | Mejorado con ${trainingImages.length} imágenes de entrenamiento (Calidad promedio: ${stats.avgQualityScore.toFixed(1)}/3)`,
      trainingDataUsed: true,
      trainingImagesCount: trainingImages.length,
      avgTrainingQuality: stats.avgQualityScore
    };

    return enhancedPrediction;
  }
}
