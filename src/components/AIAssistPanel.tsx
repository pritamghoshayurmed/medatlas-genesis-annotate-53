
import { useState } from 'react';
import { Brain, Zap, Loader2, Sparkles, Target, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Annotation } from '../types';
import { generateAIAnnotations, predictWithMonai } from '../services/mockMonaiBackend';

interface AIAssistPanelProps {
  onAnnotationsGenerated?: (annotations: Annotation[]) => void;
}

const AIAssistPanel = ({ onAnnotationsGenerated }: AIAssistPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastGenerated, setLastGenerated] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);

  const handleGenerateAnnotations = async () => {
    console.log('Starting AI annotation generation...');
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Generate AI annotations using mock backend
      const result = await predictWithMonai('mock-image-data');
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('AI annotations generated:', result.annotations);
      
      setLastGenerated(result.annotations.length);
      setConfidence(Math.round(result.confidence * 100));
      
      // Pass annotations to parent component
      if (onAnnotationsGenerated) {
        onAnnotationsGenerated(result.annotations);
      }
      
      setTimeout(() => {
        setProgress(0);
        setIsGenerating(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating AI annotations:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const aiModels = [
    {
      id: 'brain_tumor',
      name: 'Brain Tumor Segmentation',
      description: 'MONAI-powered glioblastoma detection',
      accuracy: 94,
      icon: Brain,
      color: 'text-red-400',
      isActive: true
    },
    {
      id: 'lesion_detection',
      name: 'Lesion Detection',
      description: 'Multi-class lesion identification',
      accuracy: 87,
      icon: Target,
      color: 'text-orange-400',
      isActive: false
    },
    {
      id: 'tissue_classification',
      name: 'Tissue Classification',
      description: 'Gray/white matter segmentation',
      accuracy: 91,
      icon: Activity,
      color: 'text-blue-400',
      isActive: false
    }
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm flex items-center">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-1 md:mr-2" />
            AI Assist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-3">
          <Button 
            onClick={handleGenerateAnnotations}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 font-medium text-xs md:text-sm h-8 md:h-9"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Generate AI Annotations
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1 md:h-2" />
            </div>
          )}
          
          {lastGenerated > 0 && !isGenerating && (
            <div className="text-xs text-slate-300 bg-slate-700/50 rounded p-2 md:p-3">
              <div className="flex items-center justify-between">
                <span>Last generated:</span>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                  {lastGenerated} annotations
                </Badge>
              </div>
              {confidence > 0 && (
                <div className="flex items-center justify-between mt-1">
                  <span>Avg. confidence:</span>
                  <span className="text-green-400">{confidence}%</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Models */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm">MONAI Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aiModels.map((model) => (
            <div 
              key={model.id}
              className={`p-2 md:p-3 rounded-lg border transition-all cursor-pointer ${
                model.isActive 
                  ? 'border-yellow-400/30 bg-yellow-400/10' 
                  : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 md:space-x-2 flex-1 min-w-0">
                  <model.icon className={`w-3 h-3 md:w-4 md:h-4 ${model.color} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white text-xs font-medium truncate">{model.name}</h4>
                    <p className="text-slate-400 text-xs truncate">{model.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className="text-slate-300 border-slate-500 text-xs"
                  >
                    {model.accuracy}%
                  </Badge>
                  {model.isActive && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm">AI Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-xs">Confidence threshold</span>
            <Badge variant="outline" className="text-slate-300 border-slate-500 text-xs">
              85%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-xs">Auto-review</span>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-xs">Batch processing</span>
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-2 md:p-3">
          <div className="flex items-start space-x-1 md:space-x-2">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-300 text-xs font-medium">Pro Tip</p>
              <p className="text-slate-400 text-xs">Upload high-resolution images for better AI accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistPanel;
