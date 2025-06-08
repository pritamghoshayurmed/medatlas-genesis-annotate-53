
import { useState } from 'react';
import { 
  Upload, 
  Wand2, 
  MousePointer, 
  Pen, 
  Move3D, 
  Ruler, 
  Trash2, 
  Download, 
  Save, 
  Undo, 
  Redo,
  Image as ImageIcon,
  Zap,
  Eye,
  EyeOff,
  Grid,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Annotation } from '../types';
import { useAnnotationTools } from '../hooks/useAnnotationTools';
import ImageUpload from './ImageUpload';

interface MobileAnnotationInterfaceProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  annotations: Annotation[];
  aiAnnotations: Annotation[];
  uploadedImage?: string;
  onImageUpload: (imageUrl: string, fileName: string) => void;
  onClearImage: () => void;
}

const MobileAnnotationInterface = ({
  selectedTool,
  onToolSelect,
  annotations,
  aiAnnotations,
  uploadedImage,
  onImageUpload,
  onClearImage
}: MobileAnnotationInterfaceProps) => {
  const [activeSection, setActiveSection] = useState<'tools' | 'image' | 'ai' | 'analysis'>('tools');
  const { clearAllAnnotations, deleteAnnotation } = useAnnotationTools();

  const annotationTools = [
    { id: 'select', name: 'Select', icon: MousePointer, color: 'bg-blue-500' },
    { id: 'freehand', name: 'Freehand', icon: Pen, color: 'bg-green-500' },
    { id: 'spline', name: 'Spline', icon: Move3D, color: 'bg-purple-500' },
    { id: 'ruler', name: 'Ruler', icon: Ruler, color: 'bg-orange-500' }
  ];

  const quickActions = [
    { id: 'undo', name: 'Undo', icon: Undo },
    { id: 'redo', name: 'Redo', icon: Redo },
    { id: 'save', name: 'Save', icon: Save },
    { id: 'export', name: 'Export', icon: Download }
  ];

  const viewControls = [
    { id: 'zoom-in', name: 'Zoom In', icon: ZoomIn },
    { id: 'zoom-out', name: 'Zoom Out', icon: ZoomOut },
    { id: 'reset', name: 'Reset View', icon: RotateCcw },
    { id: 'grid', name: 'Grid', icon: Grid }
  ];

  const allAnnotations = [...annotations, ...aiAnnotations];
  const totalAnnotations = allAnnotations.length;
  const aiCount = aiAnnotations.length;
  const manualCount = annotations.length;

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header with section tabs */}
      <div className="p-3 border-b border-slate-700">
        <div className="grid grid-cols-4 gap-1 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: 'tools', name: 'Tools', icon: Wand2 },
            { id: 'image', name: 'Image', icon: ImageIcon },
            { id: 'ai', name: 'AI', icon: Zap },
            { id: 'analysis', name: 'Analysis', icon: Eye }
          ].map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(section.id as any)}
              className={`flex flex-col items-center space-y-1 py-2 h-auto ${
                activeSection === section.id ? 'bg-teal-600 text-white' : 'text-slate-300'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-xs">{section.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <ScrollArea className="flex-1 p-3">
        {activeSection === 'tools' && (
          <div className="space-y-4">
            {/* Annotation Tools */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Annotation Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {annotationTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onToolSelect(tool.id)}
                      className={`flex items-center space-x-2 justify-start h-12 ${
                        selectedTool === tool.id 
                          ? 'bg-teal-600 border-teal-500 text-white' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 ${tool.color} rounded flex items-center justify-center`}>
                        <tool.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center space-x-2 justify-start h-10"
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-xs">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* View Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">View Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {viewControls.map((control) => (
                    <Button
                      key={control.id}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center space-x-2 justify-start h-10"
                    >
                      <control.icon className="w-4 h-4" />
                      <span className="text-xs">{control.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'image' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Medical Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload 
                  onImageUpload={onImageUpload}
                  currentImage={uploadedImage}
                  onClearImage={onClearImage}
                />
              </CardContent>
            </Card>

            {uploadedImage && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Image Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-green-400">Loaded</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Format:</span>
                      <span className="text-white">JPEG/PNG</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">MONAI Ready:</span>
                      <span className="text-yellow-400">Yes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'ai' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={!uploadedImage}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Run AI Segmentation
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex justify-between p-2 bg-slate-700/50 rounded">
                      <span className="text-slate-400">Model:</span>
                      <span className="text-white">Brain Tumor Segmentation</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-700/50 rounded">
                      <span className="text-slate-400">Accuracy:</span>
                      <span className="text-green-400">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {aiAnnotations.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">AI Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiAnnotations.slice(0, 3).map((annotation, index) => (
                      <div key={annotation.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <div>
                          <p className="text-white text-xs font-medium">{annotation.label}</p>
                          <p className="text-slate-400 text-xs">
                            Confidence: {Math.round((annotation.confidence || 0) * 100)}%
                          </p>
                        </div>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                          AI
                        </Badge>
                      </div>
                    ))}
                    {aiAnnotations.length > 3 && (
                      <p className="text-slate-400 text-xs text-center">
                        +{aiAnnotations.length - 3} more results
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'analysis' && (
          <div className="space-y-4">
            {/* Annotation Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Annotation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-slate-700/30 rounded">
                    <p className="text-2xl font-bold text-white">{totalAnnotations}</p>
                    <p className="text-xs text-slate-400">Total</p>
                  </div>
                  <div className="p-2 bg-slate-700/30 rounded">
                    <p className="text-2xl font-bold text-yellow-400">{aiCount}</p>
                    <p className="text-xs text-slate-400">AI</p>
                  </div>
                  <div className="p-2 bg-slate-700/30 rounded">
                    <p className="text-2xl font-bold text-green-400">{manualCount}</p>
                    <p className="text-xs text-slate-400">Manual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annotations List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">Annotations</CardTitle>
                  {allAnnotations.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllAnnotations}
                      className="border-red-600 text-red-400 hover:bg-red-600/20 h-7 px-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {allAnnotations.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">No annotations yet</p>
                ) : (
                  <div className="space-y-2">
                    {allAnnotations.slice(0, 5).map((annotation) => (
                      <div key={annotation.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{annotation.label}</p>
                          <p className="text-slate-400 text-xs">
                            {annotation.isAIGenerated ? 'AI Generated' : 'Manual'}
                            {annotation.confidence && ` • ${Math.round(annotation.confidence * 100)}%`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge 
                            variant="outline" 
                            className={annotation.isAIGenerated ? "text-yellow-400 border-yellow-400/50" : "text-green-400 border-green-400/50"}
                          >
                            {annotation.isAIGenerated ? 'AI' : 'Manual'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAnnotation(annotation.id)}
                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {allAnnotations.length > 5 && (
                      <p className="text-slate-400 text-xs text-center">
                        +{allAnnotations.length - 5} more annotations
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MobileAnnotationInterface;
