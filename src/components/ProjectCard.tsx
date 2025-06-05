
import { Calendar, Users, Image, Target, Zap, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const ProjectCard = ({ project, viewMode, onClick }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-3">{project.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <div className="flex items-center space-x-1">
                  <Image className="w-4 h-4" />
                  <span>{project.imageCount} images</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{project.annotationCount} annotations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{project.aiSuggestions} AI suggestions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.collaborators.length} collaborators</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-1">{project.name}</CardTitle>
            <Badge variant="outline" className={`${getStatusColor(project.status)} text-xs`}>
              {project.status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Image className="w-4 h-4" />
            <span>{project.imageCount}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Target className="w-4 h-4" />
            <span>{project.annotationCount}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-yellow-400">
            <Zap className="w-4 h-4" />
            <span>{project.aiSuggestions}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Users className="w-4 h-4" />
            <span>{project.collaborators.length}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(project.lastModified).toLocaleDateString()}</span>
          </div>
          <div className="flex -space-x-2">
            {project.collaborators.slice(0, 3).map((_, index) => (
              <div key={index} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{String.fromCharCode(65 + index)}</span>
              </div>
            ))}
            {project.collaborators.length > 3 && (
              <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <span className="text-white text-xs">+{project.collaborators.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
