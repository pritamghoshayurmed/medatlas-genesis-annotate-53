
import { MousePointer, Pen, Move3D, Ruler, ZoomIn, ZoomOut, RotateCcw, Eye, Grid, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileAnnotationToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  zoom: number;
  showHeatmap: boolean;
  gridVisible: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleHeatmap: () => void;
  onToggleGrid: () => void;
}

const MobileAnnotationToolbar = ({
  selectedTool,
  onToolSelect,
  zoom,
  showHeatmap,
  gridVisible,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleHeatmap,
  onToggleGrid
}: MobileAnnotationToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer, name: 'Select' },
    { id: 'freehand', icon: Pen, name: 'Freehand' },
    { id: 'spline', icon: Move3D, name: 'Spline' },
    { id: 'ruler', icon: Ruler, name: 'Ruler' }
  ];

  const viewControls = [
    { id: 'zoom-out', icon: ZoomOut, handler: onZoomOut },
    { id: 'zoom-in', icon: ZoomIn, handler: onZoomIn },
    { id: 'reset', icon: RotateCcw, handler: onResetZoom },
    { id: 'heatmap', icon: Eye, handler: onToggleHeatmap, active: showHeatmap },
    { id: 'grid', icon: Grid, handler: onToggleGrid, active: gridVisible }
  ];

  return (
    <div className="bg-teal-900/95 backdrop-blur-lg border-b border-teal-700/50 p-2">
      {/* Tools Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="text-teal-200 text-xs font-medium mr-2">Tools:</span>
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className={`h-8 w-8 p-0 ${
                selectedTool === tool.id 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-teal-200 hover:text-white hover:bg-teal-700'
              }`}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="text-teal-200 text-xs bg-teal-800/50 px-2 py-1 rounded">
          {zoom}%
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-teal-200 text-xs font-medium mr-2">View:</span>
          {viewControls.map((control) => (
            <Button
              key={control.id}
              variant={control.active ? "default" : "ghost"}
              size="sm"
              onClick={control.handler}
              className={`h-8 w-8 p-0 ${
                control.active 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-teal-200 hover:text-white hover:bg-teal-700'
              }`}
            >
              <control.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileAnnotationToolbar;
