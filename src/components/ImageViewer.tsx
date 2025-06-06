import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Annotation } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

interface ImageViewerProps {
  selectedTool: string;
  aiAnnotations?: Annotation[];
  uploadedImage?: string;
  uploadedImageName?: string;
}

interface SegmentationDot {
  id: string;
  x: number;
  y: number;
  color: string;
  region: string;
  confidence: number;
}

const ImageViewer = ({ selectedTool, aiAnnotations = [], uploadedImage, uploadedImageName }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [segmentationDots, setSegmentationDots] = useState<SegmentationDot[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleResetZoom = () => setZoom(100);

  // Generate realistic AI segmentation dots when AI annotations are received
  useEffect(() => {
    if (aiAnnotations.length > 0 && uploadedImage && imageRef.current) {
      const img = imageRef.current;
      const newDots: SegmentationDot[] = [];
      
      // Define brain regions with colors similar to the reference image
      const brainRegions = [
        { name: 'Frontal Cortex', color: '#FF6B6B', count: 8 },
        { name: 'Parietal Cortex', color: '#4ECDC4', count: 6 },
        { name: 'Temporal Cortex', color: '#45B7D1', count: 7 },
        { name: 'Occipital Cortex', color: '#96CEB4', count: 5 },
        { name: 'Cerebellum', color: '#FFEAA7', count: 4 },
        { name: 'Brainstem', color: '#DDA0DD', count: 3 },
        { name: 'Hippocampus', color: '#FFB6C1', count: 4 },
        { name: 'Amygdala', color: '#98FB98', count: 3 }
      ];

      let dotId = 0;
      brainRegions.forEach(region => {
        for (let i = 0; i < region.count; i++) {
          // Generate positions that would be realistic for brain scans
          // Center regions more towards the middle, avoiding edges
          const centerX = img.offsetWidth * 0.5;
          const centerY = img.offsetHeight * 0.5;
          const radiusX = img.offsetWidth * 0.35;
          const radiusY = img.offsetHeight * 0.35;
          
          // Create clustered regions for more realistic appearance
          const angle = (Math.PI * 2 * i) / region.count + Math.random() * 0.5;
          const distance = 0.3 + Math.random() * 0.7; // Vary distance from center
          
          const x = centerX + (Math.cos(angle) * radiusX * distance) + (Math.random() - 0.5) * 50;
          const y = centerY + (Math.sin(angle) * radiusY * distance) + (Math.random() - 0.5) * 50;
          
          // Ensure dots stay within image bounds
          const clampedX = Math.max(20, Math.min(img.offsetWidth - 20, x));
          const clampedY = Math.max(20, Math.min(img.offsetHeight - 20, y));
          
          newDots.push({
            id: `dot-${dotId++}`,
            x: clampedX,
            y: clampedY,
            color: region.color,
            region: region.name,
            confidence: 0.75 + Math.random() * 0.2 // 75-95% confidence
          });
        }
      });
      
      setSegmentationDots(newDots);
    }
  }, [aiAnnotations, uploadedImage]);

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
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
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
              style={{ 
                maxWidth: isMobile ? '350px' : '800px', 
                maxHeight: isMobile ? '350px' : '600px' 
              }}
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
            
            {/* AI Segmentation Dots */}
            {segmentationDots.map((dot) => (
              <div
                key={dot.id}
                className="absolute w-3 h-3 rounded-full border-2 border-white ai-dot"
                style={{
                  left: dot.x - 6,
                  top: dot.y - 6,
                  backgroundColor: dot.color,
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}
                title={`${dot.region} (${Math.round(dot.confidence * 100)}%)`}
              />
            ))}
            
            {/* AI Annotations Legend */}
            {(aiAnnotations.length > 0 || segmentationDots.length > 0) && (
              <div className="absolute top-4 left-4 bg-slate-900/90 rounded-lg p-2 space-y-1 max-w-48">
                {aiAnnotations.map((annotation) => (
                  <div key={annotation.id} className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 border-2 border-yellow-400 bg-yellow-400/20 rounded"></div>
                    <span className="text-yellow-400">{annotation.label}</span>
                    <span className="text-slate-300">
                      {annotation.confidence ? `${Math.round(annotation.confidence * 100)}%` : ''}
                    </span>
                  </div>
                ))}
                {segmentationDots.length > 0 && (
                  <div className="text-xs text-slate-300 border-t border-slate-600 pt-1 mt-1">
                    <span className="text-teal-400">AI Segmentation: {segmentationDots.length} regions</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="bg-slate-800 rounded-lg p-8 border-2 border-dashed border-slate-600 mx-4">
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
                <span className="hidden md:inline">File: {uploadedImageName}</span>
                {!isMobile && <span>•</span>}
              </>
            ) : (
              <span className="hidden md:inline">Slice: 45/128</span>
            )}
            <span className="hidden md:inline">Window: 400/40</span>
            <span className="hidden md:inline">Position: 0.0, 0.0 mm</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm">Ann: {totalAnnotations}</span>
            <span className="text-xs md:text-sm">AI: {aiAnnotations.length}</span>
            {segmentationDots.length > 0 && (
              <span className="text-xs md:text-sm text-teal-400">Seg: {segmentationDots.length}</span>
            )}
            {aiConfidence > 0 && (
              <span className="text-yellow-400 text-xs md:text-sm hidden md:inline">Conf: {aiConfidence}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
