
import { useRef, useEffect, useState } from 'react';
import { Annotation } from '../types';
import { useAnnotationTools } from '../hooks/useAnnotationTools';
import { useIsMobile } from '../hooks/use-mobile';
import HeatmapOverlay from './HeatmapOverlay';
import { generateHeatmapPoints } from '../utils/annotationUtils';

interface ImageCanvasProps {
  selectedTool: string;
  aiAnnotations: Annotation[];
  uploadedImage: string;
  uploadedImageName: string;
  zoom: number;
  showHeatmap: boolean;
}

const ImageCanvas = ({
  selectedTool,
  aiAnnotations,
  uploadedImage,
  uploadedImageName,
  zoom,
  showHeatmap
}: ImageCanvasProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const {
    annotations,
    drawingState,
    startDrawing,
    updateDrawing,
    finishDrawing,
    addMeasurement
  } = useAnnotationTools();

  const allAnnotations = [...annotations, ...aiAnnotations];

  const handleImageLoad = () => {
    console.log('Image loading...');
    setImageLoaded(true);
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Draw AI annotations with bright yellow highlighting
    aiAnnotations.forEach((annotation, index) => {
      if (!annotation.coordinates || annotation.coordinates.length === 0) {
        console.log('Skipping AI annotation with no coordinates:', annotation);
        return;
      }
      
      console.log(`Drawing AI annotation ${index}:`, annotation);
      
      const annotationColor = annotation.color || '#fbbf24';
      ctx.strokeStyle = annotationColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      
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
      
      ctx.fillStyle = `${annotationColor}40`;
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      if (annotation.coordinates[0] && annotation.label) {
        ctx.fillStyle = annotationColor;
        ctx.font = 'bold 14px Arial';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const labelText = `${annotation.label} (${Math.round((annotation.confidence || 0) * 100)}%)`;
        const labelX = annotation.coordinates[0][0];
        const labelY = annotation.coordinates[0][1] - 10;
        
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
      
      ctx.strokeStyle = '#10b981';
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
      
      if (annotation.type === 'rectangle' && annotation.label?.includes('Measurement:')) {
        ctx.stroke();
        ctx.shadowBlur = 0;
        
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
      
      ctx.strokeStyle = '#3b82f6';
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

  return (
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
  );
};

export default ImageCanvas;
