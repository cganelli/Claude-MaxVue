import React, { useState } from 'react';
import { Image, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import VisionCorrectedContent from './VisionCorrectedContent';

interface ImageViewerProps {
  imageUrl?: string;
  className?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
  imageUrl = 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
  className = '' 
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Image Viewer Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Image Viewer</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[50px] text-center">
              {zoom}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
            
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCw className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Content with Vision Correction */}
      <VisionCorrectedContent className="h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Sample content"
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
          }}
        />
      </VisionCorrectedContent>
    </div>
  );
};

export default ImageViewer;