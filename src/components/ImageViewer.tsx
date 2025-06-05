
import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  selectedTool: string;
}

const ImageViewer = ({ selectedTool }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
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

    // Draw existing annotations
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
  }, [annotations, currentPath, isDrawing]);

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

      {/* Cursor Info */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-lg rounded-lg p-2 border border-slate-700/50">
        <div className="text-slate-300 text-sm">
          Tool: <span className="text-white capitalize">{selectedTool}</span>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div 
          className="relative"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <img
            ref={imageRef}
            src="/placeholder.svg"
            alt="Medical scan"
            className="max-w-none bg-slate-800 rounded-lg shadow-2xl"
            style={{ width: '600px', height: '600px' }}
            draggable={false}
          />
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="absolute inset-0 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          />
          
          {/* AI Suggestions Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-32 h-24 border-2 border-dashed border-yellow-400 bg-yellow-400/10 rounded-lg">
              <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                AI: Tumor (89%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center space-x-4">
            <span>Slice: 45/128</span>
            <span>Window: 400/40</span>
            <span>Position: 0.0, 0.0 mm</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Annotations: {annotations.length}</span>
            <span>AI Confidence: 89%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
