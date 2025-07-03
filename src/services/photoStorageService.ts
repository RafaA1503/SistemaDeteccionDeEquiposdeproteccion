
export interface SavedPhoto {
  id: string;
  imageUrl: string;
  timestamp: string;
  detectionResult: any;
  filename: string;
}

export class PhotoStorageService {
  private static readonly STORAGE_KEY = 'ppe_detection_photos';

  // Guardar foto en localStorage con fecha
  static savePhoto(imageBase64: string, detectionResult: any): SavedPhoto {
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    const time = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
    const filename = `EPP_${date}_${time}.jpg`;
    
    const savedPhoto: SavedPhoto = {
      id: Date.now().toString(),
      imageUrl: `data:image/jpeg;base64,${imageBase64}`,
      timestamp,
      detectionResult,
      filename
    };

    // Obtener fotos existentes
    const existingPhotos = this.getAllPhotos();
    
    // Agregar nueva foto
    existingPhotos.push(savedPhoto);
    
    // Mantener solo las últimas 50 fotos para evitar problemas de almacenamiento
    const limitedPhotos = existingPhotos.slice(-50);
    
    // Guardar en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedPhotos));
    
    console.log(`Foto guardada: ${filename}`);
    return savedPhoto;
  }

  // Obtener todas las fotos guardadas
  static getAllPhotos(): SavedPhoto[] {
    try {
      const photosJson = localStorage.getItem(this.STORAGE_KEY);
      return photosJson ? JSON.parse(photosJson) : [];
    } catch (error) {
      console.error('Error obteniendo fotos guardadas:', error);
      return [];
    }
  }

  // Eliminar foto por ID
  static deletePhoto(photoId: string): boolean {
    try {
      const photos = this.getAllPhotos();
      const filteredPhotos = photos.filter(photo => photo.id !== photoId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPhotos));
      console.log(`Foto eliminada: ${photoId}`);
      return true;
    } catch (error) {
      console.error('Error eliminando foto:', error);
      return false;
    }
  }

  // Descargar foto
  static downloadPhoto(photo: SavedPhoto): void {
    try {
      const link = document.createElement('a');
      link.href = photo.imageUrl;
      link.download = photo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Descargando foto: ${photo.filename}`);
    } catch (error) {
      console.error('Error descargando foto:', error);
    }
  }

  // Limpiar todas las fotos
  static clearAllPhotos(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Todas las fotos han sido eliminadas');
  }
}
