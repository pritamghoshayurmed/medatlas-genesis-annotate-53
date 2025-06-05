
import { useState } from 'react';
import { Layers, Zap, Users, History, Download, Save, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageViewer from './ImageViewer';
import AnnotationTools from './AnnotationTools';
import AIAssistPanel from './AIAssistPanel';
import CollaborationPanel from './CollaborationPanel';
import LayersPanel from './LayersPanel';
import { Project, Annotation } from '../types';

interface AnnotationWorkspaceProps {
  project: Project;
  onBack: () => void;
}

const AnnotationWorkspace = ({ project }: AnnotationWorkspaceProps) => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [sidebarTab, setSidebarTab] = useState('ai');
  const [aiAnnotations, setAiAnnotations] = useState<Annotation[]>([]);

  const handleAIAnnotationsGenerated = (annotations: Annotation[]) => {
    console.log('New AI annotations received:', annotations);
    setAiAnnotations(prev => [...prev, ...annotations]);
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left Sidebar - Tools */}
      <div className="w-16 bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/50 flex flex-col items-center py-4 space-y-3">
        <AnnotationTools 
          selectedTool={selectedTool} 
          onToolSelect={setSelectedTool} 
        />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Workspace Header */}
        <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-white font-semibold">brain_scan_001.dcm</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>1024 × 1024</span>
              <span>•</span>
              <span>T1-weighted MRI</span>
              <span>•</span>
              <span className="text-yellow-400">MONAI Processing Ready</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export DICOM
            </Button>
          </div>
        </div>

        {/* Image Viewer */}
        <div className="flex-1 bg-slate-950">
          <ImageViewer 
            selectedTool={selectedTool} 
            aiAnnotations={aiAnnotations}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-lg border-l border-slate-700/50">
        <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 m-2">
            <TabsTrigger value="ai" className="flex flex-col items-center space-y-1 py-3">
              <Zap className="w-4 h-4" />
              <span className="text-xs">MONAI</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex flex-col items-center space-y-1 py-3">
              <Layers className="w-4 h-4" />
              <span className="text-xs">Layers</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex flex-col items-center space-y-1 py-3">
              <Users className="w-4 h-4" />
              <span className="text-xs">Team</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col items-center space-y-1 py-3">
              <History className="w-4 h-4" />
              <span className="text-xs">History</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="ai" className="h-full m-0">
              <AIAssistPanel onAnnotationsGenerated={handleAIAnnotationsGenerated} />
            </TabsContent>
            <TabsContent value="layers" className="h-full m-0">
              <LayersPanel />
            </TabsContent>
            <TabsContent value="team" className="h-full m-0">
              <CollaborationPanel />
            </TabsContent>
            <TabsContent value="history" className="h-full m-0">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4">Version History</h3>
                <div className="space-y-3">
                  {[
                    { version: 3, time: '2 minutes ago', action: 'AI segmentation completed' },
                    { version: 2, time: '15 minutes ago', action: 'Manual annotation added' },
                    { version: 1, time: '1 hour ago', action: 'Project created' }
                  ].map((entry) => (
                    <Card key={entry.version} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">Version {entry.version}</p>
                            <p className="text-slate-400 text-xs">{entry.time}</p>
                            <p className="text-slate-300 text-xs">{entry.action}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AnnotationWorkspace;
