
import { useState } from 'react';
import { Layers, Eye, EyeOff, Lock, Unlock, Palette, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const LayersPanel = () => {
  const [layers, setLayers] = useState([
    {
      id: 1,
      name: 'Tumor Annotations',
      visible: true,
      locked: false,
      opacity: [100],
      color: '#ef4444',
      count: 3,
      type: 'annotation'
    },
    {
      id: 2,
      name: 'AI Suggestions',
      visible: true,
      locked: true,
      opacity: [75],
      color: '#eab308',
      count: 5,
      type: 'ai'
    },
    {
      id: 3,
      name: 'Measurements',
      visible: false,
      locked: false,
      opacity: [90],
      color: '#06b6d4',
      count: 2,
      type: 'measurement'
    },
    {
      id: 4,
      name: 'Base Image',
      visible: true,
      locked: true,
      opacity: [100],
      color: '#64748b',
      count: 1,
      type: 'image'
    }
  ]);

  const toggleVisibility = (id: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLock = (id: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const updateOpacity = (id: number, opacity: number[]) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, opacity } : layer
    ));
  };

  const deleteLayer = (id: number) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'annotation': return '✏️';
      case 'measurement': return '📏';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Layer Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Layers</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-lg">{getTypeIcon(layer.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium">{layer.name}</span>
                      <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                        {layer.count}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(layer.id)}
                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                  >
                    {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLock(layer.id)}
                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                    disabled={layer.type === 'image'}
                  >
                    {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </Button>
                  
                  {layer.type !== 'image' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLayer(layer.id)}
                      className="text-slate-400 hover:text-red-400 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-8">
                <div 
                  className="w-4 h-4 rounded border border-slate-600"
                  style={{ backgroundColor: layer.color }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white h-5 w-5 p-0"
                >
                  <Palette className="w-3 h-3" />
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

      {/* Layer Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Layer Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Annotations:</span>
            <span className="text-white">11</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">AI Suggestions:</span>
            <span className="text-yellow-400">5</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Manual Edits:</span>
            <span className="text-blue-400">6</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Visible Layers:</span>
            <span className="text-green-400">{layers.filter(l => l.visible).length}/{layers.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayersPanel;
