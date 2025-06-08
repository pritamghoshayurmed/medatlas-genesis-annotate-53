import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Annotation } from '../types';
import { useIsMobile } from '../hooks/use-mobile';
import { useAnnotationTools } from '../hooks/useAnnotationTools';
import { generateHeatmapPoints, calculateAnnotationMetrics } from '../utils/annotationUtils';
import HeatmapOverlay from './HeatmapOverlay';

interface ImageViewerProps {
  selectedTool: string;
  aiAnnotations?: Annotation[];
  uploadedImage?: string;
  uploadedImageName?: string;
  zoom?: number;
  showHeatmap?: boolean;
  gridVisible?: boolean;
  onZoomChange?: (zoom: number) => void;
  hideControls?: boolean;
}

const ImageViewer = ({ 
  selectedTool, 
  aiAnnotations = [], 
  uploadedImage, 
  uploadedImageName,
  zoom: externalZoom,
  showHeatmap: externalShowHeatmap,
  gridVisible: externalGridVisible,
  onZoomChange,
  hideControls = false
}: ImageViewerProps) => {
  const [internalZoom, setInternalZoom] = useState(100);
  const [internalShowHeatmap, setInternalShowHeatmap] = useState(true);
  const [internalGridVisible, setInternalGridVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Use external state if provided, otherwise use internal state
  const zoom = externalZoom !== undefined ? externalZoom : internalZoom;
  const showHeatmap = externalShowHeatmap !== undefined ? externalShowHeatmap : internalShowHeatmap;
  const gridVisible = externalGridVisible !== undefined ? externalGridVisible : internalGridVisible;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const {
    annotations,
    setAnnotations,
    drawingState,
    startDrawing,
    updateDrawing,
    finishDrawing,
    addMeasurement,
    deleteAnnotation
  } = useAnnotationTools();

  // Combine manual and AI annotations
  const allAnnotations = [...annotations, ...aiAnnotations];

  console.log('ImageViewer render:', {
    selectedTool,
    annotationsCount: annotations.length,
    aiAnnotationsCount: aiAnnotations.length,
    imageLoaded,
    imageDimensions,
    drawingState,
    hideControls
  });

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 400);
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  const handleResetZoom = () => {
    if (onZoomChange) {
      onZoomChange(100);
    } else {
      setInternalZoom(100);
    }
  };

  const handleToggleHeatmap = () => {
    if (externalShowHeatmap === undefined) {
      setInternalShowHeatmap(!internalShowHeatmap);
    }
  };

  const handleToggleGrid = () => {
    if (externalGridVisible === undefined) {
      setInternalGridVisible(!internalGridVisible);
    }
  };

  const handleImageLoad = () => {
    console.log('Image loading...');
    setImageLoaded(true);
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      // Use the natural dimensions of the image for proper scaling
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      
      console.log('Image dimensions:', {
        natural: { width: naturalWidth, height: naturalHeight },
        display: { width: displayWidth, height: displayHeight }
      });
      
      setImageDimensions({ width: displayWidth, height: displayHeight });
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      // Set canvas style to match image exactly
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    }
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    console.log('Event position:', { x, y, rect });
    return { x, y };
  };

  const handlePointerStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPosition(e);
    console.log('Drawing start:', { pos, selectedTool });
    
    if (selectedTool === 'freehand' || selectedTool === 'spline' || selectedTool === 'ruler') {
      startDrawing(pos, selectedTool);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingState.isDrawing) return;
    
    e.preventDefault();
    const pos = getEventPosition(e);
    
    if (selectedTool === 'freehand' || selectedTool === 'spline') {
      updateDrawing(pos, selectedTool);
    }
  };

  const handlePointerEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingState.isDrawing) return;
    
    e.preventDefault();
    const pos = getEventPosition(e);
    console.log('Drawing end:', { pos, selectedTool, pathLength: drawingState.currentPath.length });
    
    if (selectedTool === 'ruler' && drawingState.startPoint) {
      addMeasurement(drawingState.startPoint, pos);
    } else if (selectedTool === 'freehand' || selectedTool === 'spline') {
      finishDrawing(selectedTool);
    }
  };

  // Enhanced drawing effect with better visibility
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Rendering annotations:', {
      aiCount: aiAnnotations.length,
      manualCount: annotations.length,
      canvasSize: { width: canvas.width, height: canvas.height }
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Draw AI annotations with bright yellow highlighting
    aiAnnotations.forEach((annotation, index) => {
      if (!annotation.coordinates || annotation.coordinates.length === 0) {
        console.log('Skipping AI annotation with no coordinates:', annotation);
        return;
      }
      
      console.log(`Drawing AI annotation ${index}:`, annotation);
      
      // Use bright yellow/orange colors for AI annotations
      const annotationColor = annotation.color || '#fbbf24'; // yellow-400
      ctx.strokeStyle = annotationColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      
      // Add glow effect
      ctx.shadowColor = annotationColor;
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      annotation.coordinates.forEach((point: number[], pointIndex: number) => {
        if (pointIndex === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      
      if (annotation.type === 'polygon') {
        ctx.closePath();
      }
      
      ctx.stroke();
      
      // Fill with semi-transparent color
      ctx.fillStyle = `${annotationColor}40`; // 25% opacity
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw label
      if (annotation.coordinates[0] && annotation.label) {
        ctx.fillStyle = annotationColor;
        ctx.font = 'bold 14px Arial';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const labelText = `${annotation.label} (${Math.round((annotation.confidence || 0) * 100)}%)`;
        const labelX = annotation.coordinates[0][0];
        const labelY = annotation.coordinates[0][1] - 10;
        
        // Text outline for readability
        ctx.strokeText(labelText, labelX, labelY);
        ctx.fillText(labelText, labelX, labelY);
      }
    });

    // Draw manual annotations with green color
    annotations.forEach((annotation, index) => {
      if (!annotation.coordinates || annotation.coordinates.length === 0) {
        console.log('Skipping manual annotation with no coordinates:', annotation);
        return;
      }
      
      console.log(`Drawing manual annotation ${index}:`, annotation);
      
      ctx.strokeStyle = '#10b981'; // emerald-500
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      
      ctx.beginPath();
      annotation.coordinates.forEach((point: number[], pointIndex: number) => {
        if (pointIndex === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      
      // Check if this is a measurement
      if (annotation.type === 'rectangle' && annotation.label?.includes('Measurement:')) {
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw measurement line and text
        const start = annotation.coordinates[0];
        const end = annotation.coordinates[1];
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px Arial';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(annotation.label || '', midX, midY - 10);
        ctx.fillText(annotation.label || '', midX, midY - 10);
      } else {
        if (annotation.type === 'polygon') {
          ctx.closePath();
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
      }
    });

    // Draw current drawing path
    if (drawingState.isDrawing && drawingState.currentPath.length > 0) {
      console.log('Drawing current path:', drawingState.currentPath);
      
      ctx.strokeStyle = '#3b82f6'; // blue-500
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      drawingState.currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw points for better visibility
      drawingState.currentPath.forEach(point => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }, [annotations, drawingState, aiAnnotations, imageLoaded]);

  const heatmapPoints = generateHeatmapPoints(imageDimensions.width, imageDimensions.height, aiAnnotations);
  const metrics = calculateAnnotationMetrics(allAnnotations);

  return (
    <div className="relative h-full flex flex-col bg-slate-950">
      {/* Controls - only show if not hidden */}
      {!hideControls && (
        <div className="absolute top-1 md:top-2 left-1 md:left-2 z-20 flex items-center space-x-1 bg-slate-900/95 backdrop-blur-lg rounded-lg p-1 border border-slate-700/50">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
            <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <span className="text-white text-xs min-w-[35px] md:min-w-[45px] text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
            <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <div className="w-px h-3 md:h-4 bg-slate-600 mx-0.5 md:mx-1" />
          <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
            <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <Button
            variant={showHeatmap ? "default" : "ghost"}
            size="sm"
            onClick={handleToggleHeatmap}
            className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0"
          >
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
      )}

      {/* Tool info */}
      <div className="absolute top-1 md:top-2 right-1 md:right-2 z-20 bg-slate-900/95 backdrop-blur-lg rounded-lg p-1 md:p-2 border border-slate-700/50">
        <div className="text-slate-300 text-xs">
          <span className="hidden md:inline">Tool: </span>
          <span className="text-white capitalize">{selectedTool}</span>
          {drawingState.isDrawing && (
            <span className="text-green-400 ml-1 md:ml-2">Drawing...</span>
          )}
        </div>
      </div>

      {/* Main image container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-1 md:p-4">
        {uploadedImage ? (
          <div 
            ref={containerRef}
            className="relative"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <img
              ref={imageRef}
              src={uploadedImage}
              alt={uploadedImageName || "Medical image"}
              className="max-w-none bg-slate-800 rounded-lg shadow-2xl"
              style={{ 
                maxWidth: isMobile ? '320px' : '700px', 
                maxHeight: isMobile ? '320px' : '500px',
                width: 'auto',
                height: 'auto'
              }}
              draggable={false}
              onLoad={handleImageLoad}
            />
            
            {imageLoaded && (
              <>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 z-10"
                  style={{
                    cursor: selectedTool === 'select' ? 'default' : 'crosshair',
                    touchAction: 'none'
                  }}
                  onMouseDown={handlePointerStart}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerEnd}
                  onMouseLeave={() => {
                    if (drawingState.isDrawing) {
                      console.log('Mouse left canvas, finishing drawing');
                      finishDrawing(selectedTool);
                    }
                  }}
                  onTouchStart={handlePointerStart}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerEnd}
                />
                
                {showHeatmap && heatmapPoints.length > 0 && (
                  <HeatmapOverlay
                    points={heatmapPoints}
                    imageWidth={imageDimensions.width}
                    imageHeight={imageDimensions.height}
                    opacity={0.4}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 p-2 md:p-4">
            <div className="bg-slate-800 rounded-lg p-4 md:p-8 border-2 border-dashed border-slate-600">
              <p className="text-sm md:text-lg mb-1 md:mb-2">No image uploaded</p>
              <p className="text-xs md:text-sm">Upload an image to start annotating</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 px-2 md:px-4 py-1">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2 md:space-x-4">
            <span>Total: {metrics.total}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-yellow-400">AI: {metrics.aiGenerated}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-green-400">Manual: {metrics.manual}</span>
          </div>
          <div className="flex items-center space-x-2">
            {metrics.avgConfidence > 0 && (
              <span className="text-teal-400 hidden md:inline">Conf: {metrics.avgConfidence}%</span>
            )}
            {uploadedImage && (
              <span className="text-slate-400">
                {isMobile ? zoom + '%' : `Zoom: ${zoom}%`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
