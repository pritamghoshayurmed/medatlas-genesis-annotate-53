import { useState } from 'react';
import { ArrowLeft, Users, Settings, Upload, FileText, Brain, Scan, Stethoscope, Home, Calendar, MessageCircle, User, ZoomIn, ZoomOut, RotateCcw, Eye, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnnotationWorkspace from '../components/AnnotationWorkspace';
import ImageUpload from '../components/ImageUpload';
import ImageViewer from '../components/ImageViewer';
import AnnotationTools from '../components/AnnotationTools';
import AIAssistPanel from '../components/AIAssistPanel';
import LayersPanel from '../components/LayersPanel';
import CollaborationPanel from '../components/CollaborationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, Annotation } from '../types';
import { useAnnotationTools } from '../hooks/useAnnotationTools';

const Index = () => {
  const [activeView, setActiveView] = useState<'home' | 'annotation'>('home');
  const [activeTab, setActiveTab] = useState<'analyze' | 'annotate'>('analyze');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [analysisOptions, setAnalysisOptions] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [aiAnnotations, setAiAnnotations] = useState<Annotation[]>([]);
  const [sidebarTab, setSidebarTab] = useState('ai');
  const [zoom, setZoom] = useState(100);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);

  // Get annotations from the hook
  const { annotations } = useAnnotationTools();

  const handleStartAnalysis = () => {
    // Create a mock project for the annotation workspace
    const mockProject: Project = {
      id: 'analysis_project',
      name: 'Medical Image Analysis',
      description: 'AI-powered medical image analysis',
      imageCount: 1,
      annotationCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'active',
      collaborators: [
        {
          id: 'user1',
          name: 'Dr. Smith',
          email: 'dr.smith@hospital.com',
          role: 'annotator' as const
        },
        {
          id: 'user2',
          name: 'Dr. Johnson',
          email: 'dr.johnson@hospital.com',
          role: 'reviewer' as const
        }
      ],
      owner: {
        id: 'current_user',
        name: 'Current User',
        email: 'user@hospital.com',
        role: 'admin' as const
      },
      aiSuggestions: 0
    };
    
    setSelectedProject(mockProject);
    setActiveView('annotation');
  };

  const handleBackToHome = () => {
    setActiveView('home');
    setSelectedProject(null);
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

  const handleAIAnnotationsGenerated = (newAnnotations: Annotation[]) => {
    console.log('New AI annotations received:', newAnnotations);
    setAiAnnotations(prev => [...prev, ...newAnnotations]);
  };

  // Zoom and view control handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleResetZoom = () => setZoom(100);
  const handleToggleHeatmap = () => setShowHeatmap(!showHeatmap);
  const handleToggleGrid = () => setGridVisible(!gridVisible);

  const scanTypes = [
    {
      id: 'xray',
      name: 'X-Ray Analysis',
      description: 'Analyze bone structure and tissues',
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      id: 'ct',
      name: 'CT Scan',
      description: 'Detailed cross-sectional images',
      icon: Brain,
      color: 'text-blue-500'
    },
    {
      id: 'mri',
      name: 'MRI Scan',
      description: 'Detailed soft tissue imaging',
      icon: Brain,
      color: 'text-blue-500'
    },
    {
      id: 'ultrasound',
      name: 'Ultrasound',
      description: 'Sound wave imaging',
      icon: Stethoscope,
      color: 'text-blue-500'
    }
  ];

  if (activeView === 'annotation') {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Enhanced header for annotation workspace with mobile controls */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Diagnosis Engine</h1>
          </div>
          
          {/* Mobile-friendly controls */}
          <div className="flex items-center space-x-1">
            {/* Zoom controls */}
            <div className="flex items-center space-x-1 bg-blue-700/50 rounded px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-blue-800 h-6 w-6 p-0"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-xs min-w-[35px] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-blue-800 h-6 w-6 p-0"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
            </div>
            
            {/* View controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant={showHeatmap ? "default" : "ghost"}
              size="sm"
              onClick={handleToggleHeatmap}
              className={`h-8 w-8 p-0 ${showHeatmap ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-700'}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant={gridVisible ? "default" : "ghost"}
              size="sm"
              onClick={handleToggleGrid}
              className={`h-8 w-8 p-0 ${gridVisible ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-700'}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-8 w-8 p-0">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnnotationWorkspace 
          project={selectedProject!}
          onBack={handleBackToHome}
          zoom={zoom}
          showHeatmap={showHeatmap}
          gridVisible={gridVisible}
          onZoomChange={setZoom}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Diagnosis Engine</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-8 w-8 p-0">
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analyze'
                ? 'text-blue-600 border-blue-600 bg-white'
                : 'text-gray-500 border-transparent bg-gray-50'
            }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('annotate')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'annotate'
                ? 'text-blue-600 border-blue-600 bg-white'
                : 'text-gray-500 border-transparent bg-gray-50'
            }`}
          >
            Annotate
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-6">
        {activeTab === 'analyze' && (
          <>
            {/* Medical Image Analysis Section */}
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Medical Image Analysis</h2>
              <p className="text-gray-600 text-sm px-4">
                Our AI engine analyzes medical images and provides diagnostic insights
              </p>
            </div>

            {/* Analysis Options */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <button
                  onClick={() => setAnalysisOptions(!analysisOptions)}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Analysis Options</span>
                  </div>
                  <div className={`transform transition-transform ${analysisOptions ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Image Upload Section */}
            <Card className="bg-white border-2 border-dashed border-gray-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Drag & drop medical image here</h3>
                  <p className="text-sm text-gray-500 mb-2">Supported formats: JPEG, PNG, DICOM, NIfTI</p>
                  <p className="text-xs text-gray-400 mb-4">Maximum file size: 4MB (Gemini API limit)</p>
                  
                  <ImageUpload 
                    onImageUpload={handleImageUpload}
                    currentImage={uploadedImage}
                    onClearImage={handleClearImage}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scan Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Scan Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {scanTypes.map((scan) => (
                  <Card key={scan.id} className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <scan.icon className={`w-6 h-6 ${scan.color}`} />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{scan.name}</h4>
                      <p className="text-xs text-gray-500">{scan.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Start Analysis Button */}
            {uploadedImage && (
              <div className="pt-4">
                <Button 
                  onClick={handleStartAnalysis}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Start Analysis & Annotation
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === 'annotate' && (
          <div className="bg-slate-950 rounded-lg min-h-[600px] relative">
            {uploadedImage ? (
              <div className="flex h-[600px]">
                {/* Left sidebar - tools */}
                <div className="w-16 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700/50 flex flex-col items-center py-4 space-y-2 rounded-l-lg">
                  <AnnotationTools 
                    selectedTool={selectedTool} 
                    onToolSelect={setSelectedTool} 
                  />
                </div>

                {/* Main workspace */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Header */}
                  <div className="bg-slate-800/90 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <h3 className="text-white font-semibold text-base truncate">{uploadedImageName || 'medical_image.jpg'}</h3>
                      <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-400">
                        <span>Custom Upload</span>
                        <span>•</span>
                        <span className="text-green-400">Image Loaded</span>
                        <span>•</span>
                        <span className="text-yellow-400">Ready for Annotation</span>
                      </div>
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
                      onZoomChange={setZoom}
                      hideControls={true}
                    />
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="w-80 bg-slate-900/90 backdrop-blur-lg border-l border-slate-700/50 rounded-r-lg">
                  <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
                    <div className="p-2">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 h-16">
                        <TabsTrigger value="ai" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                          <Brain className="w-3 h-3" />
                          <span className="text-xs">AI</span>
                        </TabsTrigger>
                        <TabsTrigger value="layers" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                          <FileText className="w-3 h-3" />
                          <span className="text-xs">Layers</span>
                        </TabsTrigger>
                        <TabsTrigger value="team" className="flex flex-col items-center space-y-1 py-2 data-[state=active]:bg-teal-600">
                          <Users className="w-3 h-3" />
                          <span className="text-xs">Team</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <TabsContent value="ai" className="h-full m-0">
                        <div className="p-4 h-full overflow-y-auto">
                          <AIAssistPanel onAnnotationsGenerated={handleAIAnnotationsGenerated} />
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
                    </div>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-center">
                <div className="text-slate-400 p-8">
                  <div className="bg-slate-800 rounded-lg p-8 border-2 border-dashed border-slate-600">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg mb-2">No image uploaded</p>
                    <p className="text-sm">Upload an image in the "Analyze" tab to start annotating</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          <button className="flex flex-col items-center py-2 px-2">
            <Home className="w-5 h-5 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 px-2">
            <Calendar className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Appointments</span>
          </button>
          <button className="flex flex-col items-center py-2 px-2">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mb-1">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-blue-600">Diagnosis</span>
          </button>
          <button className="flex flex-col items-center py-2 px-2">
            <MessageCircle className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Chat</span>
          </button>
          <button className="flex flex-col items-center py-2 px-2">
            <User className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
