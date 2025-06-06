
import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Grid, Eye } from 'lucide-react';
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
}

const ImageViewer = ({ selectedTool, aiAnnotations = [], uploadedImage, uploadedImageName }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleResetZoom = () => setZoom(100);

  const handleImageLoad = () => {
    setImageLoaded(true);
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      // Get the actual rendered dimensions
      const rect = img.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;
      
      setImageDimensions({ width: displayWidth, height: displayHeight });
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      console.log('Image loaded with dimensions:', displayWidth, 'x', displayHeight);
    }
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getMousePosition(e);
    console.log('Mouse down at:', pos, 'Tool:', selectedTool);
    
    if (selectedTool === 'freehand' || selectedTool === 'spline') {
      startDrawing(pos, selectedTool);
    } else if (selectedTool === 'ruler') {
      startDrawing(pos, selectedTool);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingState.isDrawing) return;
    
    const pos = getMousePosition(e);
    
    if (selectedTool === 'freehand' || selectedTool === 'spline') {
      updateDrawing(pos, selectedTool);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawingState.isDrawing) return;
    
    const pos = getMousePosition(e);
    console.log('Mouse up at:', pos, 'Tool:', selectedTool);
    
    if (selectedTool === 'ruler' && drawingState.startPoint) {
      addMeasurement(drawingState.startPoint, pos);
    } else if (selectedTool === 'freehand' || selectedTool === 'spline') {
      finishDrawing(selectedTool);
    }
  };

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw AI annotations with yellow/orange style
    aiAnnotations.forEach(annotation => {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      
      if (annotation.coordinates && annotation.coordinates.length > 0) {
        ctx.beginPath();
        annotation.coordinates.forEach((point: number[], index: number) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        });
        
        if (annotation.type === 'polygon') {
          ctx.closePath();
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
        ctx.fill();
        
        // Draw label
        if (annotation.coordinates[0]) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(
            `${annotation.label} (${Math.round((annotation.confidence || 0) * 100)}%)`,
            annotation.coordinates[0][0],
            annotation.coordinates[0][1] - 5
          );
        }
      }
    });

    // Draw manual annotations with green style
    annotations.forEach(annotation => {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      
      if (annotation.coordinates && annotation.coordinates.length > 0) {
        ctx.beginPath();
        annotation.coordinates.forEach((point: number[], index: number) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]);
          } else {
            ctx.lineTo(point[0], point[1]);
          }
        });
        
        // Check if this is a measurement
        if (annotation.type === 'rectangle' && annotation.label?.includes('Measurement:')) {
          ctx.stroke();
          // Draw measurement line and text
          const start = annotation.coordinates[0];
          const end = annotation.coordinates[1];
          const midX = (start[0] + end[0]) / 2;
          const midY = (start[1] + end[1]) / 2;
          
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(annotation.label || '', midX, midY - 8);
        } else {
          if (annotation.type === 'polygon') {
            ctx.closePath();
          }
          ctx.stroke();
          ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
          ctx.fill();
        }
      }
    });

    // Draw current drawing path
    if (drawingState.isDrawing && drawingState.currentPath.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      drawingState.currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      
      // Draw points for better visibility
      drawingState.currentPath.forEach(point => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [annotations, drawingState, aiAnnotations, imageLoaded]);

  const heatmapPoints = generateHeatmapPoints(imageDimensions.width, imageDimensions.height, aiAnnotations);
  const metrics = calculateAnnotationMetrics(allAnnotations);

  console.log('Heatmap points generated:', heatmapPoints.length, 'Image dimensions:', imageDimensions);

  return (
    <div className="relative h-full flex flex-col bg-slate-950">
      {/* Controls */}
      <div className="absolute top-2 left-2 z-20 flex items-center space-x-1 md:space-x-2 bg-slate-900/90 backdrop-blur-lg rounded-lg p-1 md:p-2 border border-slate-700/50">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-slate-300 hover:text-white h-8 w-8 p-0">
          <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
        <span className="text-white text-xs md:text-sm min-w-[45px] text-center">{zoom}%</span>
        <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-slate-300 hover:text-white h-8 w-8 p-0">
          <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-600 mx-1" />
        <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-slate-300 hover:text-white h-8 w-8 p-0">
          <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
        <Button
          variant={showHeatmap ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="text-slate-300 hover:text-white h-8 w-8 p-0"
        >
          <Eye className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>

      {/* Tool info */}
      <div className="absolute top-2 right-2 z-20 bg-slate-900/90 backdrop-blur-lg rounded-lg p-1 md:p-2 border border-slate-700/50">
        <div className="text-slate-300 text-xs md:text-sm">
          <span className="hidden md:inline">Tool: </span>
          <span className="text-white capitalize text-xs">{selectedTool}</span>
          {drawingState.isDrawing && (
            <span className="text-green-400 ml-2">Drawing...</span>
          )}
        </div>
      </div>

      {/* Main image container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-2 md:p-4">
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
                maxWidth: isMobile ? '300px' : '700px', 
                maxHeight: isMobile ? '300px' : '500px',
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
                  className="absolute inset-0 cursor-crosshair z-10"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => drawingState.isDrawing && finishDrawing(selectedTool)}
                  style={{
                    width: imageDimensions.width,
                    height: imageDimensions.height
                  }}
                />
                
                {showHeatmap && heatmapPoints.length > 0 && (
                  <HeatmapOverlay
                    points={heatmapPoints}
                    imageWidth={imageDimensions.width}
                    imageHeight={imageDimensions.height}
                    opacity={0.5}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 p-4">
            <div className="bg-slate-800 rounded-lg p-6 md:p-8 border-2 border-dashed border-slate-600">
              <p className="text-base md:text-lg mb-2">No image uploaded</p>
              <p className="text-sm">Upload an image to start annotating</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="bg-slate-900/90 backdrop-blur-lg border-t border-slate-700/50 px-2 md:px-4 py-1 md:py-2">
        <div className="flex items-center justify-between text-xs md:text-sm text-slate-300">
          <div className="flex items-center space-x-2 md:space-x-4">
            <span>Total: {metrics.total}</span>
            <span className="hidden md:inline">•</span>
            <span className="text-yellow-400">AI: {metrics.aiGenerated}</span>
            <span className="hidden md:inline">•</span>
            <span className="text-green-400">Manual: {metrics.manual}</span>
          </div>
          <div className="flex items-center space-x-2">
            {metrics.avgConfidence > 0 && (
              <span className="text-teal-400">Conf: {metrics.avgConfidence}%</span>
            )}
            {uploadedImage && (
              <span className="text-slate-400 text-xs">
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
