
import { MousePointer, Paintbrush, Square, Circle, Polygon, Eraser, Type, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnnotationToolsProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const AnnotationTools = ({ selectedTool, onToolSelect }: AnnotationToolsProps) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'brush', icon: Paintbrush, label: 'Brush' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'polygon', icon: Polygon, label: 'Polygon' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === tool.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onToolSelect(tool.id)}
                className={`w-10 h-10 p-0 ${
                  selectedTool === tool.id 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default AnnotationTools;
