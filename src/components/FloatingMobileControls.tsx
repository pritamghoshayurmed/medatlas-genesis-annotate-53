
import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Grid, Settings, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FloatingMobileControlsProps {
  zoom: number;
  showHeatmap: boolean;
  gridVisible: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleHeatmap: () => void;
  onToggleGrid: () => void;
}

const FloatingMobileControls = ({
  zoom,
  showHeatmap,
  gridVisible,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleHeatmap,
  onToggleGrid
}: FloatingMobileControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-12 h-12 p-0 shadow-lg border-2 border-teal-500"
          >
            <ChevronUp className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-teal-900/95 backdrop-blur-lg border-teal-700/50 p-2 mb-2"
          align="end"
          side="top"
          sideOffset={8}
        >
          <div className="flex flex-col space-y-2">
            {/* Zoom controls */}
            <div className="flex items-center space-x-2 bg-teal-800/50 rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-xs min-w-[40px] text-center font-medium">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* View controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetZoom}
                className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                variant={showHeatmap ? "default" : "ghost"}
                size="sm"
                onClick={onToggleHeatmap}
                className={`h-8 w-8 p-0 ${
                  showHeatmap 
                    ? 'bg-teal-600 text-white hover:bg-teal-500' 
                    : 'text-teal-200 hover:text-white hover:bg-teal-700'
                }`}
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                variant={gridVisible ? "default" : "ghost"}
                size="sm"
                onClick={onToggleGrid}
                className={`h-8 w-8 p-0 ${
                  gridVisible 
                    ? 'bg-teal-600 text-white hover:bg-teal-500' 
                    : 'text-teal-200 hover:text-white hover:bg-teal-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingMobileControls;
