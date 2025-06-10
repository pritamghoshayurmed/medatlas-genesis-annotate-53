
import { useState } from 'react';
import { ChevronDown, Zap, Layers, Users, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import AIAssistPanel from './AIAssistPanel';
import LayersPanel from './LayersPanel';
import CollaborationPanel from './CollaborationPanel';
import MobileAnnotationInterface from './MobileAnnotationInterface';
import ImageUpload from './ImageUpload';
import { Annotation } from '../types';

interface MobileDropdownHeaderProps {
  annotations: Annotation[];
  aiAnnotations: Annotation[];
  uploadedImage?: string;
  onImageUpload: (imageUrl: string, fileName: string) => void;
  onClearImage: () => void;
  onAIAnnotationsGenerated: (annotations: Annotation[]) => void;
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const MobileDropdownHeader = ({
  annotations,
  aiAnnotations,
  uploadedImage,
  onImageUpload,
  onClearImage,
  onAIAnnotationsGenerated,
  selectedTool,
  onToolSelect
}: MobileDropdownHeaderProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'ai',
      icon: Zap,
      label: 'MONAI',
      content: (
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Medical Image
            </h3>
            <ImageUpload 
              onImageUpload={onImageUpload}
              currentImage={uploadedImage}
              onClearImage={onClearImage}
            />
          </div>
          <div className="flex-1">
            <AIAssistPanel onAnnotationsGenerated={onAIAnnotationsGenerated} />
          </div>
        </div>
      )
    },
    {
      id: 'layers',
      icon: Layers,
      label: 'Layers',
      content: (
        <div className="max-h-[70vh] overflow-y-auto">
          <LayersPanel 
            annotations={annotations}
            aiAnnotations={aiAnnotations}
          />
        </div>
      )
    },
    {
      id: 'team',
      icon: Users,
      label: 'Team',
      content: (
        <div className="max-h-[70vh] overflow-y-auto">
          <CollaborationPanel />
        </div>
      )
    },
    {
      id: 'annotate',
      icon: Edit3,
      label: 'Annotate',
      content: (
        <div className="max-h-[70vh] overflow-y-auto">
          <MobileAnnotationInterface 
            selectedTool={selectedTool}
            onToolSelect={onToolSelect}
            annotations={annotations}
            aiAnnotations={aiAnnotations}
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            onClearImage={onClearImage}
          />
        </div>
      )
    }
  ];

  const handleDropdownChange = (menuId: string) => {
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };

  return (
    <div className="relative">
      {/* Header with dropdown buttons */}
      <div className="bg-teal-800/90 border-b border-teal-700/50 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {menuItems.map((item) => (
              <DropdownMenu key={item.id} open={activeDropdown === item.id} onOpenChange={(open) => {
                if (open) {
                  setActiveDropdown(item.id);
                } else if (activeDropdown === item.id) {
                  setActiveDropdown(null);
                }
              }}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 h-8 px-2 ${
                      activeDropdown === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-200 hover:text-white hover:bg-teal-700'
                    }`}
                  >
                    <item.icon className="w-3 h-3" />
                    <span className="text-xs">{item.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${
                      activeDropdown === item.id ? 'rotate-180' : ''
                    }`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 max-w-[90vw] bg-teal-900/95 backdrop-blur-lg border-teal-700/50 p-0"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <div className="bg-teal-900/95 backdrop-blur-lg">
                    {item.content}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
          
          <div className="text-teal-200 text-xs">
            <span className="text-white capitalize">{selectedTool}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDropdownHeader;
