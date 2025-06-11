import { useState } from 'react';
import { ArrowLeft, Users, Settings, Upload, FileText, Brain, Scan, Stethoscope, Home, Calendar, MessageCircle, User, ZoomIn, ZoomOut, RotateCcw, Eye, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import AnnotationWorkspace from '../components/AnnotationWorkspace';
import MedicalAnalysis from '../components/MedicalAnalysis';
import ImageUpload from '../components/ImageUpload';
import { Project, User } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'project'>('dashboard');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('annotate');
  
  // Separate state for analysis section
  const [analysisImage, setAnalysisImage] = useState<string>('');
  const [analysisImageName, setAnalysisImageName] = useState<string>('');

  const isMobile = useIsMobile();

  // Mock users for collaborators
  const mockUsers: User[] = [
    { id: '1', name: 'Dr. Smith', email: 'smith@hospital.com', role: 'admin', isOnline: true },
    { id: '2', name: 'Dr. Johnson', email: 'johnson@hospital.com', role: 'annotator', isOnline: false },
    { id: '3', name: 'Dr. Williams', email: 'williams@hospital.com', role: 'reviewer', isOnline: true },
    { id: '4', name: 'Dr. Brown', email: 'brown@hospital.com', role: 'annotator', isOnline: true },
    { id: '5', name: 'Dr. Davis', email: 'davis@hospital.com', role: 'reviewer', isOnline: false }
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Brain Tumor Segmentation',
      description: 'T1-weighted MRI scan analysis for tumor detection and boundary mapping',
      lastModified: '2024-01-15',
      imageCount: 12,
      annotationCount: 45,
      collaborators: [mockUsers[0], mockUsers[1], mockUsers[2]],
      status: 'active',
      priority: 'high',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      owner: mockUsers[0],
      aiSuggestions: 15
    },
    {
      id: '2',
      name: 'Lung Nodule Detection',
      description: 'CT scan analysis for early detection of lung nodules',
      lastModified: '2024-01-10',
      imageCount: 8,
      annotationCount: 32,
      collaborators: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
      status: 'active',
      priority: 'medium',
      createdAt: '2023-12-15',
      updatedAt: '2024-01-10',
      owner: mockUsers[1],
      aiSuggestions: 8
    },
    {
      id: '3',
      name: 'Cardiomegaly Assessment',
      description: 'Chest X-ray analysis for heart size and shape abnormalities',
      lastModified: '2023-12-28',
      imageCount: 5,
      annotationCount: 20,
      collaborators: [mockUsers[2], mockUsers[4]],
      status: 'completed',
      priority: 'low',
      createdAt: '2023-12-01',
      updatedAt: '2023-12-28',
      owner: mockUsers[2],
      aiSuggestions: 5
    }
  ];

  const handleProjectOpen = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('project');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentProject(null);
  };

  // Independent handlers for analysis section only
  const handleAnalysisImageUpload = (imageUrl: string, fileName: string) => {
    setAnalysisImage(imageUrl);
    setAnalysisImageName(fileName);
    console.log('Analysis image uploaded:', fileName);
  };

  const handleAnalysisImageClear = () => {
    if (analysisImage) {
      URL.revokeObjectURL(analysisImage);
    }
    setAnalysisImage('');
    setAnalysisImageName('');
    console.log('Analysis image cleared');
  };

  if (currentView === 'project' && currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950">
        <Header 
          activeView="annotation"
          onBackToDashboard={handleBackToDashboard}
          selectedProject={currentProject}
        />
        <div className="pt-16">
          <AnnotationWorkspace 
            project={currentProject} 
            onBack={handleBackToDashboard}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950">
      <Header 
        activeView="dashboard"
        onBackToDashboard={handleBackToDashboard}
      />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Medical AI Diagnosis Engine
            </h1>
            <p className="text-teal-200 text-lg max-w-2xl mx-auto">
              Advanced medical image analysis and annotation platform powered by AI and MONAI
            </p>
          </div>

          {/* Main Interface */}
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-teal-800/50 h-12">
                  <TabsTrigger 
                    value="analyze" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-teal-200"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze
                  </TabsTrigger>
                  <TabsTrigger 
                    value="annotate" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-teal-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Annotate
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Analysis Tab */}
              <TabsContent value="analyze" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Analysis Image Upload */}
                  <div className="lg:col-span-1">
                    <Card className="bg-teal-800/50 border-teal-700/50 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center">
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Medical Image
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ImageUpload 
                          onImageUpload={handleAnalysisImageUpload}
                          currentImage={analysisImage}
                          onClearImage={handleAnalysisImageClear}
                        />
                        
                        {analysisImage && (
                          <div className="mt-4 p-3 bg-teal-700/30 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Image Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-teal-300">Status:</span>
                                <span className="text-green-400">Ready for Analysis</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-teal-300">AI Model:</span>
                                <span className="text-white">Medical Gemma 3</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analysis Results */}
                  <div className="lg:col-span-2">
                    {analysisImage ? (
                      <div className="space-y-6">
                        {/* Image Preview */}
                        <Card className="bg-teal-800/50 border-teal-700/50 backdrop-blur-lg">
                          <CardContent className="p-6">
                            <div className="flex justify-center">
                              <img
                                src={analysisImage}
                                alt={analysisImageName || "Medical scan"}
                                className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* AI Analysis Component */}
                        <MedicalAnalysis scanType="mri" />
                      </div>
                    ) : (
                      <Card className="bg-teal-800/50 border-teal-700/50 backdrop-blur-lg">
                        <CardContent className="p-12">
                          <div className="text-center">
                            <Scan className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                              Ready for Analysis
                            </h3>
                            <p className="text-teal-300">
                              Upload a medical image to begin AI-powered analysis
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Annotation Tab - Completely Independent */}
              <TabsContent value="annotate" className="space-y-6">
                <Card className="bg-teal-800/50 border-teal-700/50 backdrop-blur-lg">
                  <CardContent className="p-0">
                    <Dashboard 
                      onProjectOpen={handleProjectOpen}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
