
import { useState, useEffect } from 'react';
import { Zap, Brain, Target, Settings, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiService, AIModel, SegmentationJob } from '../services/aiService';
import { Annotation } from '../types';

interface AIAssistPanelProps {
  onAnnotationsGenerated?: (annotations: Annotation[]) => void;
}

const AIAssistPanel = ({ onAnnotationsGenerated }: AIAssistPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState([75]);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [currentJob, setCurrentJob] = useState<SegmentationJob | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Annotation[]>([]);
  const [pendingSuggestions, setPendingSuggestions] = useState<Annotation[]>([]);

  useEffect(() => {
    loadAvailableModels();
  }, []);

  const loadAvailableModels = async () => {
    try {
      const models = await aiService.getAvailableModels();
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0].id);
      }
    } catch (error) {
      console.error('Failed to load AI models:', error);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedModel) return;

    setIsProcessing(true);
    setCurrentJob(null);
    setPendingSuggestions([]);

    try {
      const jobId = await aiService.startSegmentation(
        'current_image', 
        selectedModel,
        (job: SegmentationJob) => {
          setCurrentJob(job);
          
          if (job.status === 'completed' && job.results) {
            const filteredResults = job.results.filter(
              annotation => (annotation.confidence || 0) >= confidence[0] / 100
            );
            
            setAiSuggestions(prev => [...prev, ...filteredResults]);
            setPendingSuggestions(filteredResults);
            setIsProcessing(false);
            
            if (onAnnotationsGenerated) {
              onAnnotationsGenerated(filteredResults);
            }
          } else if (job.status === 'failed') {
            setIsProcessing(false);
          }
        }
      );
      
      console.log('Segmentation job started:', jobId);
    } catch (error) {
      console.error('Failed to start segmentation:', error);
      setIsProcessing(false);
    }
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, isAIGenerated: false }
          : suggestion
      )
    );
    setPendingSuggestions(prev => 
      prev.filter(suggestion => suggestion.id !== suggestionId)
    );
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => 
      prev.filter(suggestion => suggestion.id !== suggestionId)
    );
    setPendingSuggestions(prev => 
      prev.filter(suggestion => suggestion.id !== suggestionId)
    );
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    if (confidence >= 0.8) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (confidence >= 0.6) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  return (
    <div className="p-4 space-y-4">
      {/* AI Model Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span>MONAI AI Models</span>
            {isProcessing && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Select Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Choose AI model" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="text-white">
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-xs text-slate-400">{model.accuracy * 100}% accuracy</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Confidence Threshold</span>
              <span className="text-white">{confidence[0]}%</span>
            </div>
            <Slider
              value={confidence}
              onValueChange={setConfidence}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleStartProcessing}
              disabled={isProcessing || !selectedModel}
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
              size="sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-2" />
                  Run Segmentation
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {currentJob && currentJob.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Running MONAI inference...</span>
                <span>{currentJob.progress}%</span>
              </div>
              <Progress value={currentJob.progress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Target className="w-4 h-4 text-yellow-400" />
            <span>AI Suggestions</span>
            {pendingSuggestions.length > 0 && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10 text-xs">
                {pendingSuggestions.length} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSuggestions.length === 0 ? (
            <div className="text-center py-6">
              <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No AI suggestions yet</p>
              <p className="text-slate-500 text-xs">Run segmentation to get AI-powered annotations</p>
            </div>
          ) : (
            aiSuggestions.slice(-3).map((suggestion) => {
              const isPending = pendingSuggestions.some(p => p.id === suggestion.id);
              return (
                <div
                  key={suggestion.id}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium">{suggestion.label}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                      >
                        {suggestion.confidence ? `${Math.round(suggestion.confidence * 100)}%` : 'N/A'}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isPending
                          ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                          : 'text-green-400 border-green-400/30 bg-green-400/10'
                      }`}
                    >
                      {isPending ? 'pending' : 'accepted'}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-400 text-xs mb-3">
                    Generated by {suggestion.author} • {suggestion.coordinates.length} points
                  </p>
                  
                  {isPending && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptSuggestion(suggestion.id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-7 text-xs border-slate-600 text-slate-300"
                        onClick={() => handleRejectSuggestion(suggestion.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>MONAI Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:text-white"
            onClick={() => setSelectedModel('organ_segmentation')}
          >
            Multi-organ segmentation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:text-white"
            onClick={() => setSelectedModel('lesion_detection')}
          >
            Lesion detection
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:text-white">
            Generate metrics report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistPanel;
