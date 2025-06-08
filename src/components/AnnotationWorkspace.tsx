
import { useState } from 'react';
import { Layers, Zap, Users, Edit3, Download, Save, Undo, Redo, Upload, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ImageViewer from './ImageViewer';
import AnnotationTools from './AnnotationTools';
import AIAssistPanel from './AIAssistPanel';
import CollaborationPanel from './CollaborationPanel';
import LayersPanel from './LayersPanel';
import ImageUpload from './ImageUpload';
import MobileAnnotationInterface from './MobileAnnotationInterface';
import { Project, Annotation } from '../types';
import { useIsMobile } from '../hooks/use-mobile';
import { useAnnotationTools } from '../hooks/useAnnotationTools';

interface AnnotationWorkspaceProps {
  project: Project;
  onBack: () => void;
  zoom?: number;
  showHeatmap?: boolean;
  gridVisible?: boolean;
  onZoomChange?: (zoom: number) => void;
}

const AnnotationWorkspace = ({ 
  project, 
  zoom = 100, 
  showHeatmap = true, 
  gridVisible = false, 
  onZoomChange 
}: AnnotationWorkspaceProps) => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [sidebarTab, setSidebarTab] = useState('ai');
  const [aiAnnotations, setAiAnnotations] = useState<Annotation[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get annotations from the hook to pass to layers panel
  const { annotations } = useAnnotationTools();

  const handleAIAnnotationsGenerated = (newAnnotations: Annotation[]) => {
    console.log('New AI annotations received:', newAnnotations);
    setAiAnnotations(prev => [...prev, ...newAnnotations]);
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
    <div className="flex h-[calc(100vh-80px)] relative bg-slate-950">
      {/* Mobile overlay buttons */}
      {isMobile && (
        <div className="absolute top-2 left-2 z-50 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 h-8 w-8 p-0"
          >
            <Menu className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 h-8 w-8 p-0"
          >
            <Zap className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Left sidebar - tools */}
      <div className={`${
        isMobile 
          ? `fixed top-0 left-0 h-full w-16 bg-slate-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 'w-16 bg-slate-900/90 backdrop-blur-lg'
      } border-r border-slate-700/50 flex flex-col items-center py-2 md:py-4 space-y-2`}>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(false)}
            className="text-white hover:bg-slate-800 mb-2 h-8 w-8 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
        <AnnotationTools 
          selectedTool={selectedTool} 
          onToolSelect={setSelectedTool} 
        />
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/50 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <h3 className="text-white font-semibold text-sm md:text-base truncate">{displayFileName}</h3>
            <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-400">
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
              <span className="text-yellow-400">MONAI Ready</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white h-8 w-8 p-0 hidden md:flex">
              <Undo className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white h-8 w-8 p-0 hidden md:flex">
              <Redo className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white h-8 px-2">
              <Save className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline text-xs">Save</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white h-8 px-2 hidden lg:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Image viewer */}
        <div className="flex-1 min-h-0">
          <ImageViewer 
            selectedTool={selectedTool} 
            aiAnnotations={aiAnnotations}
            uploadedImage={uploadedImage}
            uploadedImageName={uploadedImageName}
            zoom={zoom}
            showHeatmap={showHeatmap}
            gridVisible={gridVisible}
            onZoomChange={onZoomChange}
            hideControls={true}
          />
        </div>
      </div>

      {/* Right sidebar */}
      <div className={`${
        isMobile 
          ? `fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}` 
          : 'w-80 bg-slate-900/90 backdrop-blur-lg'
      } border-l border-slate-700/50`}>
        <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 h-16">
              <TabsTrigger value="ai" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                <Zap className="w-3 h-3" />
                <span className="text-xs">MONAI</span>
              </TabsTrigger>
              <TabsTrigger value="layers" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                <Layers className="w-3 h-3" />
                <span className="text-xs">Layers</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                <Users className="w-3 h-3" />
                <span className="text-xs">Team</span>
              </TabsTrigger>
              <TabsTrigger value="annotate" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                <Edit3 className="w-3 h-3" />
                <span className="text-xs">Annotate</span>
              </TabsTrigger>
            </TabsList>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRightSidebarOpen(false)}
                className="text-white hover:bg-slate-800 ml-2 h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="ai" className="h-full m-0">
              <div className="p-3 md:p-4 space-y-3 md:space-y-4 h-full overflow-y-auto">
                <div>
                  <h3 className="text-white font-semibold mb-2 md:mb-3 flex items-center text-sm">
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Medical Image
                  </h3>
                  <ImageUpload 
                    onImageUpload={handleImageUpload}
                    currentImage={uploadedImage}
                    onClearImage={handleClearImage}
                  />
                </div>
                <div className="flex-1">
                  <AIAssistPanel onAnnotationsGenerated={handleAIAnnotationsGenerated} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="layers" className="h-full m-0">
              <LayersPanel 
                annotations={annotations}
                aiAnnotations={aiAnnotations}
              />
            </TabsContent>
            <TabsContent value="team" className="h-full m-0">
              <CollaborationPanel />
            </TabsContent>
            <TabsContent value="annotate" className="h-full m-0">
              <MobileAnnotationInterface 
                selectedTool={selectedTool}
                onToolSelect={setSelectedTool}
                annotations={annotations}
                aiAnnotations={aiAnnotations}
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Mobile backdrop */}
      {isMobile && (isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 z-30"
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
