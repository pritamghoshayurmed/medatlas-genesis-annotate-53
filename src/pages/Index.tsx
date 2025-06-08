
import { useState } from 'react';
import { ArrowLeft, Users, Settings, Upload, FileText, Brain, Scan, Stethoscope, Home, Calendar, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnnotationWorkspace from '../components/AnnotationWorkspace';
import ImageUpload from '../components/ImageUpload';
import { Project } from '../types';

const Index = () => {
  const [activeView, setActiveView] = useState<'home' | 'annotation'>('home');
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [analysisOptions, setAnalysisOptions] = useState(false);

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
    console.log('Image uploaded:', fileName);
  };

  const handleClearImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage('');
    console.log('Image cleared');
  };

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
        {/* Header for annotation workspace */}
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
          <div className="flex items-center space-x-2">
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
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-blue-600 bg-white'
                : 'text-gray-500 border-transparent bg-gray-50'
            }`}
          >
            History
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

        {activeTab === 'history' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
            <p className="text-gray-500 text-sm">Your previous analyses will appear here</p>
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
