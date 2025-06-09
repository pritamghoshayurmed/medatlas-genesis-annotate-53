
import { ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerControlsProps {
  zoom: number;
  showHeatmap: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleHeatmap: () => void;
  hideControls?: boolean;
}

const ImageViewerControls = ({
  zoom,
  showHeatmap,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleHeatmap,
  hideControls = false
}: ImageViewerControlsProps) => {
  if (hideControls) return null;

  return (
    <div className="absolute top-1 md:top-2 left-1 md:left-2 z-20 flex items-center space-x-1 bg-slate-900/95 backdrop-blur-lg rounded-lg p-1 border border-slate-700/50">
      <Button variant="ghost" size="sm" onClick={onZoomOut} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
        <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <span className="text-white text-xs min-w-[35px] md:min-w-[45px] text-center">{zoom}%</span>
      <Button variant="ghost" size="sm" onClick={onZoomIn} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
        <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <div className="w-px h-3 md:h-4 bg-slate-600 mx-0.5 md:mx-1" />
      <Button variant="ghost" size="sm" onClick={onResetZoom} className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0">
        <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
      <Button
        variant={showHeatmap ? "default" : "ghost"}
        size="sm"
        onClick={onToggleHeatmap}
        className="text-slate-300 hover:text-white h-6 w-6 md:h-8 md:w-8 p-0"
      >
        <Eye className="w-3 h-3 md:w-4 md:h-4" />
      </Button>
    </div>
  );
};

export default ImageViewerControls;
