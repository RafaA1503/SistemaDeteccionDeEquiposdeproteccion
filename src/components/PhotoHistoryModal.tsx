
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Download, Trash2, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { SavedPhoto } from '../services/photoStorageService';

interface PhotoHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhotos: SavedPhoto[];
  onDeletePhoto: (photoId: string) => void;
  onDownloadPhoto: (photo: SavedPhoto) => void;
}

const PhotoHistoryModal: React.FC<PhotoHistoryModalProps> = ({
  isOpen,
  onClose,
  savedPhotos,
  onDeletePhoto,
  onDownloadPhoto
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour12: false })
    };
  };

  const getComplianceColor = (result: any) => {
    return result?.overallCompliance ? 'text-green-600' : 'text-red-600';
  };

  const getComplianceIcon = (result: any) => {
    return result?.overallCompliance ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Historial de Detecciones EPP</span>
            <Badge variant="outline">{savedPhotos.length} fotos</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {savedPhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay fotos guardadas</p>
              <p className="text-sm">Las detecciones se guardarán automáticamente aquí</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPhotos.slice().reverse().map((photo) => {
                const { date, time } = formatDate(photo.timestamp);
                const result = photo.detectionResult;
                
                return (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.filename}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onDownloadPhoto(photo)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeletePhoto(photo.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Fecha y hora */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{date}</span>
                            <Clock className="h-4 w-4" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getComplianceIcon(result)}
                            <span className={`text-sm font-medium ${getComplianceColor(result)}`}>
                              {result?.overallCompliance ? 'CUMPLE' : 'NO CUMPLE'}
                            </span>
                          </div>
                        </div>

                        {/* Estado de EPP */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center space-x-1 ${result?.hasHelmet ? 'text-green-600' : 'text-red-600'}`}>
                            {result?.hasHelmet ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>Casco</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${result?.hasGloves ? 'text-green-600' : 'text-red-600'}`}>
                            {result?.hasGloves ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>Guantes</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${result?.hasSafetyGlasses ? 'text-green-600' : 'text-red-600'}`}>
                            {result?.hasSafetyGlasses ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>Gafas</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${result?.hasMask ? 'text-green-600' : 'text-red-600'}`}>
                            {result?.hasMask ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>Mascarilla</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${result?.hasVest ? 'text-green-600' : 'text-red-600'}`}>
                            {result?.hasVest ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>Chaleco</span>
                          </div>
                        </div>

                        {/* Elementos faltantes */}
                        {result?.missingItems && result.missingItems.length > 0 && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs font-medium text-red-800 mb-1">Elementos faltantes:</p>
                            <p className="text-xs text-red-700">{result.missingItems.join(', ')}</p>
                          </div>
                        )}

                        {/* Confianza */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Confianza:</span>
                          <Badge variant="outline" className="text-xs">
                            {result?.confidence}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoHistoryModal;
