
import { useState } from 'react';
import { Upload, Brain, FileText, Loader2, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { analyzeMedicalImage, MedicalAnalysisResult } from '../services/medicalAnalysisService';

interface MedicalAnalysisProps {
  scanType: 'xray' | 'ct' | 'mri' | 'ultrasound';
}

const MedicalAnalysis = ({ scanType }: MedicalAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<MedicalAnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setAnalysisResult(null);
      console.log('File uploaded for analysis:', file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const result = await analyzeMedicalImage(uploadedFile, scanType);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      
      console.log('Analysis completed:', result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const scanTypeLabels = {
    xray: 'X-Ray',
    ct: 'CT Scan',
    mri: 'MRI',
    ultrasound: 'Ultrasound'
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white border-2 border-dashed border-teal-300">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              Upload {scanTypeLabels[scanType]} for AI Analysis
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Powered by Google Medical Gemma 3 AI
            </p>
            
            <input
              type="file"
              accept="image/*,.dcm"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            
            {uploadedFile && (
              <div className="mt-4 p-3 bg-teal-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-teal-800">{uploadedFile.name}</span>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-white border border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-medium text-gray-900">AI Analysis in Progress</h3>
                <p className="text-sm text-gray-500">Google Medical Gemma 3 is analyzing your image...</p>
              </div>
            </div>
            <Progress value={progress} className="w-full mb-2" />
            <p className="text-xs text-gray-500 text-center">{Math.round(progress)}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-4">
          <Card className="bg-white border border-teal-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Analysis Complete
                </CardTitle>
                <Badge variant="outline" className="text-teal-600 border-teal-300">
                  {Math.round(analysisResult.confidence * 100)}% Confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diagnosis */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysisResult.diagnosis}</p>
              </div>

              {/* Findings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                <ul className="space-y-2">
                  {analysisResult.findings.map((finding, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Processed in {Math.round(analysisResult.metadata.processingTime / 1000)}s</span>
                </div>
                <div>
                  <span>Type: {scanTypeLabels[analysisResult.metadata.scanType as keyof typeof scanTypeLabels]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trusted Sources */}
          <Card className="bg-white border border-teal-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Trusted Medical Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {analysisResult.sources.map((source, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm">{source.title}</h5>
                      <p className="text-gray-600 text-xs mt-1">{source.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 p-1"
                      onClick={() => window.open(source.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalAnalysis;
