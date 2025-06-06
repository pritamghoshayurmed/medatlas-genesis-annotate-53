
import { useState } from 'react';
import { Layers, Zap, Users, History, Download, Save, Undo, Redo, Upload, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageViewer from './ImageViewer';
import AnnotationTools from './AnnotationTools';
import AIAssistPanel from './AIAssistPanel';
import CollaborationPanel from './CollaborationPanel';
import LayersPanel from './LayersPanel';
import ImageUpload from './ImageUpload';
import { Project, Annotation } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

interface AnnotationWorkspaceProps {
  project: Project;
  onBack: () => void;
}

const AnnotationWorkspace = ({ project }: AnnotationWorkspaceProps) => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [sidebarTab, setSidebarTab] = useState('ai');
  const [aiAnnotations, setAiAnnotations] = useState<Annotation[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAIAnnotationsGenerated = (annotations: Annotation[]) => {
    console.log('New AI annotations received:', annotations);
    setAiAnnotations(prev => [...prev, ...annotations]);
  };

  const handleImageUpload = (imageUrl: string, fileName: string) => {
    setUploadedImage(imageUrl);
    setUploadedImageName(fileName);
    console.log('Image uploaded:', fileName);
  };

  const handleClearImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage('');
    setUploadedImageName('');
    setAiAnnotations([]);
    console.log('Image cleared');
  };

  const displayFileName = uploadedImageName || 'brain_scan_001.dcm';

  return (
    <div className="flex h-[calc(100vh-80px)] relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="absolute top-4 left-4 z-50 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700"
          >
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Left Sidebar - Tools */}
      <div className={`${
        isMobile 
          ? `mobile-sidebar ${isLeftSidebarOpen ? 'open' : ''} w-16 bg-slate-900/90 backdrop-blur-lg` 
          : 'w-16 bg-slate-900/80 backdrop-blur-lg'
      } border-r border-slate-700/50 flex flex-col items-center py-4 space-y-3`}>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(false)}
            className="text-white hover:bg-slate-800 mb-4"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
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
            <h3 className="text-white font-semibold text-sm md:text-base">{displayFileName}</h3>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
              {uploadedImage ? (
                <>
                  <span>Custom Upload</span>
                  <span>•</span>
                  <span className="text-green-400">Image Loaded</span>
                </>
              ) : (
                <>
                  <span>1024 × 1024</span>
                  <span>•</span>
                  <span>T1-weighted MRI</span>
                </>
              )}
              <span>•</span>
              <span className="text-yellow-400">MONAI Processing Ready</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hidden md:flex">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hidden md:flex">
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Save className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hidden md:flex">
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
            uploadedImage={uploadedImage}
            uploadedImageName={uploadedImageName}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`${
        isMobile 
          ? `mobile-sidebar ${isRightSidebarOpen ? 'open' : ''} w-80 right-0 bg-slate-900/90 backdrop-blur-lg` 
          : 'w-80 bg-slate-900/80 backdrop-blur-lg'
      } border-l border-slate-700/50`}>
        <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="ai" className="flex flex-col items-center space-y-1 py-2">
                <Zap className="w-3 h-3" />
                <span className="text-xs">MONAI</span>
              </TabsTrigger>
              <TabsTrigger value="layers" className="flex flex-col items-center space-y-1 py-2">
                <Layers className="w-3 h-3" />
                <span className="text-xs">Layers</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex flex-col items-center space-y-1 py-2">
                <Users className="w-3 h-3" />
                <span className="text-xs">Team</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col items-center space-y-1 py-2">
                <History className="w-3 h-3" />
                <span className="text-xs">History</span>
              </TabsTrigger>
            </TabsList>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRightSidebarOpen(false)}
                className="text-white hover:bg-slate-800 ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="ai" className="h-full m-0">
              <div className="p-4 space-y-4 h-full overflow-y-auto">
                {/* Image Upload Section */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Medical Image
                  </h3>
                  <ImageUpload 
                    onImageUpload={handleImageUpload}
                    currentImage={uploadedImage}
                    onClearImage={handleClearImage}
                  />
                </div>

                {/* AI Assist Panel */}
                <div className="flex-1">
                  <AIAssistPanel onAnnotationsGenerated={handleAIAnnotationsGenerated} />
                </div>
              </div>
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

      {/* Mobile overlay */}
      {isMobile && (isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AnnotationWorkspace;
