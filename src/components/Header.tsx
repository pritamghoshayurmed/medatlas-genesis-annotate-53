
import { useState } from 'react';
import { Brain, Users, Settings, Bell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '../types';

interface HeaderProps {
  activeView: 'dashboard' | 'annotation';
  onBackToDashboard: () => void;
  selectedProject?: Project | null;
}

const Header = ({ activeView, onBackToDashboard, selectedProject }: HeaderProps) => {
  const [notifications] = useState(3);

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {activeView === 'annotation' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToDashboard}
              className="text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MedAtlas</h1>
              <p className="text-sm text-slate-400">AI Medical Imaging Annotator</p>
            </div>
          </div>

          {selectedProject && (
            <div className="ml-8">
              <h2 className="text-lg font-semibold text-white">{selectedProject.name}</h2>
              <p className="text-sm text-slate-400">{selectedProject.imageCount} images • {selectedProject.collaborators.length} collaborators</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-300">4 online</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </Button>
          
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>

          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">DR</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
