import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Annotation } from '../types';

interface ImageViewerProps {
  selectedTool: string;
  aiAnnotations?: Annotation[];
  uploadedImage?: string;
  uploadedImageName?: string;
}

const ImageViewer = ({ selectedTool, aiAnnotations = [], uploadedImage, uploadedImageName }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleResetZoom = () => setZoom(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw AI annotations
    aiAnnotations.forEach(annotation => {
      ctx.strokeStyle = annotation.isAIGenerated ? '#fbbf24' : '#10b981';
      ctx.lineWidth = annotation.isAIGenerated ? 3 : 2;
      ctx.beginPath();
      
      if (annotation.coordinates && annotation.coordinates.length > 0) {
        annotation.coordinates.forEach((point: number[], index: number) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        });
        
        if (annotation.type === 'polygon' && annotation.coordinates.length > 2) {
          ctx.closePath();
        }
        
        ctx.stroke();
        
        if (annotation.isAIGenerated) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
          ctx.fill();
        }
      }
    });

    // Draw existing manual annotations
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      annotation.points.forEach((point: any, index: number) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    // Draw current path if drawing
    if (isDrawing && currentPath.length > 0) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  }, [annotations, currentPath, isDrawing, aiAnnotations]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'brush' || selectedTool === 'polygon') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPath([{ x, y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && (selectedTool === 'brush' || selectedTool === 'polygon')) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPath(prev => [...prev, { x, y }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 0) {
      setAnnotations(prev => [...prev, {
        id: Date.now(),
        points: currentPath,
        color: '#10b981',
        type: selectedTool
      }]);
      setCurrentPath([]);
      setIsDrawing(false);
    }
  };

  const totalAnnotations = annotations.length + aiAnnotations.length;
  const aiConfidence = aiAnnotations.length > 0 
    ? Math.round((aiAnnotations.reduce((sum, ann) => sum + (ann.confidence || 0), 0) / aiAnnotations.length) * 100)
    : 0;

  return (
    <div className="relative h-full flex flex-col">
      {/* Image Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-lg rounded-lg p-2 border border-slate-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-slate-300 hover:text-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-white text-sm min-w-[60px] text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-slate-300 hover:text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-600 mx-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetZoom}
          className="text-slate-300 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Tool Info */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-lg rounded-lg p-2 border border-slate-700/50">
        <div className="text-slate-300 text-sm">
          Tool: <span className="text-white capitalize">{selectedTool}</span>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {uploadedImage ? (
          <div 
            className="relative"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <img
              ref={imageRef}
              src={uploadedImage}
              alt={uploadedImageName || "Uploaded medical image"}
              className="max-w-none bg-slate-800 rounded-lg shadow-2xl"
              style={{ maxWidth: '800px', maxHeight: '600px' }}
              draggable={false}
              onLoad={handleImageLoad}
            />
            {imageLoaded && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDrawing(false)}
              />
            )}
            
            {/* AI Annotations Legend */}
            {aiAnnotations.length > 0 && (
              <div className="absolute top-4 left-4 bg-slate-900/90 rounded-lg p-2 space-y-1">
                {aiAnnotations.map((annotation) => (
                  <div key={annotation.id} className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 border-2 border-yellow-400 bg-yellow-400/20 rounded"></div>
                    <span className="text-yellow-400">{annotation.label}</span>
                    <span className="text-slate-300">
                      {annotation.confidence ? `${Math.round(annotation.confidence * 100)}%` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="bg-slate-800 rounded-lg p-8 border-2 border-dashed border-slate-600">
              <p className="text-lg mb-2">No image uploaded</p>
              <p className="text-sm">Upload an image to start annotating</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center space-x-4">
            {uploadedImage && uploadedImageName ? (
              <>
                <span>File: {uploadedImageName}</span>
                <span>•</span>
              </>
            ) : (
              <span>Slice: 45/128</span>
            )}
            <span>Window: 400/40</span>
            <span>Position: 0.0, 0.0 mm</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Annotations: {totalAnnotations}</span>
            <span>AI Suggestions: {aiAnnotations.length}</span>
            {aiConfidence > 0 && (
              <span className="text-yellow-400">AI Confidence: {aiConfidence}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
