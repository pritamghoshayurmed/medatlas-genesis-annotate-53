
import { ZoomIn, ZoomOut, RotateCcw, Eye, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerControlsProps {
  zoom: number;
  showHeatmap: boolean;
  gridVisible?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleHeatmap: () => void;
  onToggleGrid?: () => void;
  hideControls?: boolean;
}

const ImageViewerControls = ({
  zoom,
  showHeatmap,
  gridVisible = false,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleHeatmap,
  onToggleGrid,
  hideControls = false
}: ImageViewerControlsProps) => {
  if (hideControls) return null;

  return (
    <div className="absolute bottom-1 md:top-2 left-1/2 -translate-x-1/2 md:left-2 md:translate-x-0 z-20 flex items-center space-x-1 bg-teal-900/95 backdrop-blur-lg rounded-lg p-1 border border-teal-700/50">
      <Button variant="ghost" size="sm" onClick={onZoomOut} className="text-teal-200 hover:text-white hover:bg-teal-700 h-6 w-6 md:h-8 md:w-8 p-0">
        <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <span className="text-white text-xs min-w-[35px] md:min-w-[45px] text-center">{zoom}%</span>
      <Button variant="ghost" size="sm" onClick={onZoomIn} className="text-teal-200 hover:text-white hover:bg-teal-700 h-6 w-6 md:h-8 md:w-8 p-0">
        <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <div className="w-px h-3 md:h-4 bg-teal-600 mx-0.5 md:mx-1" />
      <Button variant="ghost" size="sm" onClick={onResetZoom} className="text-teal-200 hover:text-white hover:bg-teal-700 h-6 w-6 md:h-8 md:w-8 p-0">
        <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <Button
        variant={showHeatmap ? "default" : "ghost"}
        size="sm"
        onClick={onToggleHeatmap}
        className={`h-6 w-6 md:h-8 md:w-8 p-0 ${
          showHeatmap 
            ? 'bg-teal-600 text-white hover:bg-teal-500' 
            : 'text-teal-200 hover:text-white hover:bg-teal-700'
        }`}
      >
        <Eye className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      {onToggleGrid && (
        <Button
          variant={gridVisible ? "default" : "ghost"}
          size="sm"
          onClick={onToggleGrid}
          className={`h-6 w-6 md:h-8 md:w-8 p-0 ${
            gridVisible 
              ? 'bg-teal-600 text-white hover:bg-teal-500' 
              : 'text-teal-200 hover:text-white hover:bg-teal-700'
          }`}
        >
          <Grid className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      )}
    </div>
  );
};

export default ImageViewerControls;
