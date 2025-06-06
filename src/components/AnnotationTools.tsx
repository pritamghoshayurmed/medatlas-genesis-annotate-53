
import { MousePointer, Paintbrush, PenTool, Ruler, Target, Eraser, Type, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnnotationToolsProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const AnnotationTools = ({ selectedTool, onToolSelect }: AnnotationToolsProps) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select & Move' },
    { id: 'freehand', icon: Paintbrush, label: 'Freehand Drawing' },
    { id: 'spline', icon: PenTool, label: 'Spline Curve' },
    { id: 'ruler', icon: Ruler, label: 'Measurement Tool' },
    { id: 'marker', icon: Target, label: 'Point Marker' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text Annotation' },
    { id: 'ai-assist', icon: Zap, label: 'AI Smart Select' },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === tool.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onToolSelect(tool.id)}
                className={`w-12 h-12 p-0 transition-all duration-200 ${
                  selectedTool === tool.id 
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/80'
                }`}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
              <p className="text-sm">{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default AnnotationTools;
