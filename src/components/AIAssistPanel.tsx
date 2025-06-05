
import { useState } from 'react';
import { Zap, Brain, Target, Settings, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

const AIAssistPanel = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState([75]);

  const aiSuggestions = [
    {
      id: 1,
      type: 'Tumor',
      confidence: 89,
      region: 'Frontal lobe',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Edema',
      confidence: 72,
      region: 'Parietal region',
      status: 'accepted'
    },
    {
      id: 3,
      type: 'Ventricle',
      confidence: 95,
      region: 'Lateral ventricle',
      status: 'pending'
    }
  ];

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* AI Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span>AI Assistant</span>
            {isProcessing && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Model: MedSeg-v2.1</span>
            <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
              Active
            </Badge>
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
              disabled={isProcessing}
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
                  Run AI
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Analyzing regions...</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-1" />
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
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10 text-xs">
              {aiSuggestions.filter(s => s.status === 'pending').length} new
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium">{suggestion.type}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      suggestion.confidence >= 80
                        ? 'text-green-400 border-green-400/30 bg-green-400/10'
                        : suggestion.confidence >= 60
                        ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                        : 'text-red-400 border-red-400/30 bg-red-400/10'
                    }`}
                  >
                    {suggestion.confidence}%
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    suggestion.status === 'accepted'
                      ? 'text-green-400 border-green-400/30 bg-green-400/10'
                      : 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                  }`}
                >
                  {suggestion.status}
                </Badge>
              </div>
              
              <p className="text-slate-400 text-xs mb-3">{suggestion.region}</p>
              
              {suggestion.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700">
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs border-slate-600 text-slate-300">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:text-white">
            Auto-segment all regions
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:text-white">
            Detect anomalies
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:text-white">
            Generate report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistPanel;
