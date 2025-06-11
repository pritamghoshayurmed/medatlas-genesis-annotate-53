
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
import MobileAnnotationToolbar from './MobileAnnotationToolbar';
import MobileDropdownHeader from './MobileDropdownHeader';
import FloatingMobileControls from './FloatingMobileControls';
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
  
  // Independent image state for annotation workspace
  const [workspaceImage, setWorkspaceImage] = useState<string>('');
  const [workspaceImageName, setWorkspaceImageName] = useState<string>('');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 600 });
  
  // Mobile-specific state management
  const [mobileZoom, setMobileZoom] = useState(100);
  const [mobileShowHeatmap, setMobileShowHeatmap] = useState(true);
  const [mobileGridVisible, setMobileGridVisible] = useState(false);
  
  const isMobile = useIsMobile();

  // Get annotations from the hook to pass to layers panel
  const { annotations } = useAnnotationTools();

  const handleAIAnnotationsGenerated = (newAnnotations: Annotation[]) => {
    console.log('New AI annotations received in workspace:', newAnnotations);
    setAiAnnotations(prev => [...prev, ...newAnnotations]);
  };

  // Independent image handlers for workspace
  const handleWorkspaceImageUpload = (imageUrl: string, fileName: string) => {
    setWorkspaceImage(imageUrl);
    setWorkspaceImageName(fileName);
    
    // Get image dimensions when uploaded
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      console.log('Workspace image dimensions updated:', { width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageUrl;
    
    console.log('Workspace image uploaded:', fileName);
  };

  const handleWorkspaceImageClear = () => {
    if (workspaceImage) {
      URL.revokeObjectURL(workspaceImage);
    }
    setWorkspaceImage('');
    setWorkspaceImageName('');
    setAiAnnotations([]);
    setImageDimensions({ width: 800, height: 600 });
    console.log('Workspace image cleared');
  };

  // Mobile-specific handlers
  const handleMobileZoomIn = () => {
    const newZoom = Math.min(mobileZoom + 25, 400);
    setMobileZoom(newZoom);
    console.log('Mobile zoom in to:', newZoom);
  };

  const handleMobileZoomOut = () => {
    const newZoom = Math.max(mobileZoom - 25, 25);
    setMobileZoom(newZoom);
    console.log('Mobile zoom out to:', newZoom);
  };

  const handleMobileResetZoom = () => {
    setMobileZoom(100);
    console.log('Mobile zoom reset to 100%');
  };

  const handleMobileToggleHeatmap = () => {
    setMobileShowHeatmap(!mobileShowHeatmap);
    console.log('Mobile heatmap toggled to:', !mobileShowHeatmap);
  };

  const handleMobileToggleGrid = () => {
    setMobileGridVisible(!mobileGridVisible);
    console.log('Mobile grid toggled to:', !mobileGridVisible);
  };

  const displayFileName = workspaceImageName || 'brain_scan_001.dcm';

  // Use mobile state on mobile, external state on desktop
  const currentZoom = isMobile ? mobileZoom : zoom;
  const currentShowHeatmap = isMobile ? mobileShowHeatmap : showHeatmap;
  const currentGridVisible = isMobile ? mobileGridVisible : gridVisible;

  return (
    <div className="flex h-[calc(100vh-80px)] relative bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950">
      {/* Mobile overlay buttons */}
      {isMobile && (
        <div className="absolute top-2 left-2 z-50 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="bg-teal-900/90 text-white hover:bg-teal-800 border border-teal-700 h-8 w-8 p-0"
          >
            <Menu className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Left sidebar - tools */}
      <div className={`${
        isMobile 
          ? `fixed top-0 left-0 h-full w-16 bg-teal-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 'w-16 bg-teal-900/90 backdrop-blur-lg'
      } border-r border-teal-700/50 flex flex-col items-center py-2 md:py-4 space-y-2`}>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLeftSidebarOpen(false)}
            className="text-white hover:bg-teal-800 mb-2 h-8 w-8 p-0"
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
        {!isMobile ? (
          <div className="bg-teal-800/90 border-b border-teal-700/50 px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
              <h3 className="text-white font-semibold text-sm md:text-base truncate">{displayFileName}</h3>
              <div className="hidden lg:flex items-center space-x-2 text-sm text-teal-300">
                {workspaceImage ? (
                  <>
                    <span>Custom Upload</span>
                    <span>•</span>
                    <span className="text-cyan-400">Image Loaded</span>
                  </>
                ) : (
                  <>
                    <span>1024 × 1024</span>
                    <span>•</span>
                    <span>T1-weighted MRI</span>
                  </>
                )}
                <span>•</span>
                <span className="text-teal-300">MONAI Ready</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-2">
              <Button variant="ghost" size="sm" className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0 hidden md:flex">
                <Undo className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 w-8 p-0 hidden md:flex">
                <Redo className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 px-2">
                <Save className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline text-xs">Save</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-teal-200 hover:text-white hover:bg-teal-700 h-8 px-2 hidden lg:flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        ) : (
          <MobileDropdownHeader 
            annotations={annotations}
            aiAnnotations={aiAnnotations}
            uploadedImage={workspaceImage}
            onImageUpload={handleWorkspaceImageUpload}
            onClearImage={handleWorkspaceImageClear}
            onAIAnnotationsGenerated={handleAIAnnotationsGenerated}
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        )}

        {/* Image viewer - full screen on mobile */}
        <div className="flex-1 min-h-0">
          <ImageViewer 
            selectedTool={selectedTool} 
            aiAnnotations={aiAnnotations}
            uploadedImage={workspaceImage}
            uploadedImageName={workspaceImageName}
            zoom={currentZoom}
            showHeatmap={currentShowHeatmap}
            gridVisible={currentGridVisible}
            onZoomChange={isMobile ? setMobileZoom : onZoomChange}
            hideControls={isMobile}
          />
        </div>

        {/* Floating controls for mobile */}
        {isMobile && workspaceImage && (
          <FloatingMobileControls
            zoom={currentZoom}
            showHeatmap={currentShowHeatmap}
            gridVisible={currentGridVisible}
            onZoomIn={handleMobileZoomIn}
            onZoomOut={handleMobileZoomOut}
            onResetZoom={handleMobileResetZoom}
            onToggleHeatmap={handleMobileToggleHeatmap}
            onToggleGrid={handleMobileToggleGrid}
          />
        )}
      </div>

      {/* Right sidebar - only visible on desktop */}
      {!isMobile && (
        <div className="w-80 bg-teal-900/90 backdrop-blur-lg border-l border-teal-700/50">
          <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
            <div className="flex items-center justify-between p-2">
              <TabsList className="grid w-full grid-cols-4 bg-teal-800/50 h-16">
                <TabsTrigger value="ai" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-cyan-600">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">MONAI</span>
                </TabsTrigger>
                <TabsTrigger value="layers" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-cyan-600">
                  <Layers className="w-3 h-3" />
                  <span className="text-xs">Layers</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-cyan-600">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">Team</span>
                </TabsTrigger>
                <TabsTrigger value="annotate" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-cyan-600">
                  <Edit3 className="w-3 h-3" />
                  <span className="text-xs">Annotate</span>
                </TabsTrigger>
              </TabsList>
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
                      onImageUpload={handleWorkspaceImageUpload}
                      currentImage={workspaceImage}
                      onClearImage={handleWorkspaceImageClear}
                    />
                  </div>
                  <div className="flex-1">
                    <AIAssistPanel 
                      onAnnotationsGenerated={handleAIAnnotationsGenerated}
                      imageUrl={workspaceImage}
                      imageWidth={imageDimensions.width}
                      imageHeight={imageDimensions.height}
                    />
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
                  uploadedImage={workspaceImage}
                  onImageUpload={handleWorkspaceImageUpload}
                  onClearImage={handleWorkspaceImageClear}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {/* Mobile backdrop */}
      {isMobile && isLeftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsLeftSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AnnotationWorkspace;
