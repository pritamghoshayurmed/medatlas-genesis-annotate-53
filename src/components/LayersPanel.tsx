
import { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff, Lock, Unlock, Palette, Trash2, Plus, Bot, PenTool, Ruler, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface LayersPanelProps {
  annotations?: any[];
  aiAnnotations?: any[];
  onLayerVisibilityChange?: (layerType: string, visible: boolean) => void;
  onLayerOpacityChange?: (layerType: string, opacity: number) => void;
}

const LayersPanel = ({ 
  annotations = [], 
  aiAnnotations = [],
  onLayerVisibilityChange,
  onLayerOpacityChange 
}: LayersPanelProps) => {
  const [layers, setLayers] = useState([
    {
      id: 'ai-annotations',
      name: 'AI Annotations',
      visible: true,
      locked: true,
      opacity: [85],
      color: '#eab308',
      count: 0,
      type: 'ai',
      icon: Bot
    },
    {
      id: 'manual-annotations',
      name: 'Manual Annotations',
      visible: true,
      locked: false,
      opacity: [100],
      color: '#10b981',
      count: 0,
      type: 'annotation',
      icon: PenTool
    },
    {
      id: 'measurements',
      name: 'Measurements',
      visible: true,
      locked: false,
      opacity: [90],
      color: '#06b6d4',
      count: 0,
      type: 'measurement',
      icon: Ruler
    },
    {
      id: 'heatmap',
      name: 'AI Heatmap',
      visible: true,
      locked: false,
      opacity: [50],
      color: '#f59e0b',
      count: 0,
      type: 'heatmap',
      icon: Flame
    }
  ]);

  // Update layer counts when annotations change
  useEffect(() => {
    setLayers(prev => prev.map(layer => {
      switch (layer.type) {
        case 'ai':
          return { ...layer, count: aiAnnotations.length };
        case 'annotation':
          return { 
            ...layer, 
            count: annotations.filter(ann => 
              !ann.label?.includes('Measurement:') && !ann.isAIGenerated
            ).length 
          };
        case 'measurement':
          return { 
            ...layer, 
            count: annotations.filter(ann => 
              ann.label?.includes('Measurement:')
            ).length 
          };
        case 'heatmap':
          return { ...layer, count: aiAnnotations.length > 0 ? 1 : 0 };
        default:
          return layer;
      }
    }));
  }, [annotations, aiAnnotations]);

  const toggleVisibility = (id: string) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === id) {
        const newVisible = !layer.visible;
        if (onLayerVisibilityChange) {
          onLayerVisibilityChange(layer.type, newVisible);
        }
        return { ...layer, visible: newVisible };
      }
      return layer;
    }));
  };

  const toggleLock = (id: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const updateOpacity = (id: string, opacity: number[]) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === id) {
        if (onLayerOpacityChange) {
          onLayerOpacityChange(layer.type, opacity[0]);
        }
        return { ...layer, opacity };
      }
      return layer;
    }));
  };

  const deleteLayer = (id: string) => {
    console.log('Delete layer functionality would be implemented here for:', id);
  };

  const totalAnnotations = layers.reduce((sum, layer) => sum + layer.count, 0);
  const visibleLayers = layers.filter(l => l.visible).length;
  const aiCount = layers.find(l => l.type === 'ai')?.count || 0;
  const manualCount = layers.find(l => l.type === 'annotation')?.count || 0;

  return (
    <div className="p-2 md:p-4 space-y-3 md:space-y-4">
      {/* Layer Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm flex items-center justify-between">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Layers className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              <span>Layers</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-5 w-5 md:h-6 md:w-6 p-0">
              <Plus className="w-2 h-2 md:w-3 md:h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-3">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-1 md:space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 md:space-x-2 flex-1 min-w-0">
                  <layer.icon className="w-3 h-3 md:w-4 md:h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-white text-xs md:text-sm font-medium truncate">{layer.name}</span>
                      <Badge 
                        variant="outline" 
                        className="text-slate-400 border-slate-600 text-xs flex-shrink-0"
                      >
                        {layer.count}
                      </Badge>
                      {!layer.visible && (
                        <Badge variant="outline" className="text-red-400 border-red-400/30 text-xs flex-shrink-0">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-0.5 md:space-x-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(layer.id)}
                    className={`h-5 w-5 md:h-6 md:w-6 p-0 ${
                      layer.visible 
                        ? 'text-green-400 hover:text-green-300' 
                        : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-2 h-2 md:w-3 md:h-3" /> : <EyeOff className="w-2 h-2 md:w-3 md:h-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLock(layer.id)}
                    className="text-slate-400 hover:text-white h-5 w-5 md:h-6 md:w-6 p-0"
                    disabled={layer.type === 'ai'}
                  >
                    {layer.locked ? <Lock className="w-2 h-2 md:w-3 md:h-3" /> : <Unlock className="w-2 h-2 md:w-3 md:h-3" />}
                  </Button>
                  
                  {layer.type !== 'ai' && layer.count > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLayer(layer.id)}
                      className="text-slate-400 hover:text-red-400 h-5 w-5 md:h-6 md:w-6 p-0"
                    >
                      <Trash2 className="w-2 h-2 md:w-3 md:h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2 ml-4 md:ml-6">
                <div 
                  className="w-3 h-3 md:w-4 md:h-4 rounded border border-slate-600 flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white h-4 w-4 md:h-5 md:w-5 p-0"
                >
                  <Palette className="w-2 h-2 md:w-3 md:h-3" />
                </Button>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Opacity</span>
                    <span className="text-xs text-white">{layer.opacity[0]}%</span>
                  </div>
                  <Slider
                    value={layer.opacity}
                    onValueChange={(value) => updateOpacity(layer.id, value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Layer Statistics - More compact on mobile */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 md:space-y-2">
          <div className="grid grid-cols-2 gap-2 md:space-y-0 md:block md:space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">{totalAnnotations}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">AI:</span>
              <span className="text-yellow-400">{aiCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Manual:</span>
              <span className="text-green-400">{manualCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Visible:</span>
              <span className="text-blue-400">{visibleLayers}/{layers.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Simplified for mobile */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-white text-xs md:text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 md:space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:text-white text-xs h-7 md:h-8"
            onClick={() => {
              layers.forEach(layer => {
                if (!layer.visible) toggleVisibility(layer.id);
              });
            }}
          >
            Show all
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:text-white text-xs h-7 md:h-8"
            onClick={() => {
              layers.forEach(layer => {
                if (layer.visible && layer.type !== 'ai') toggleVisibility(layer.id);
              });
            }}
          >
            Hide manual
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayersPanel;
