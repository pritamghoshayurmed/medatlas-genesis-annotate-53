
import { useState } from 'react';
import { Plus, Search, Filter, Grid, List, BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProjectCard from './ProjectCard';
import StatsCard from './StatsCard';
import { Project } from '../types';

interface DashboardProps {
  onProjectSelect: (project: Project) => void;
}

const Dashboard = ({ onProjectSelect }: DashboardProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Brain Tumor Segmentation',
      description: 'MRI scans for glioblastoma detection and segmentation using AI-assisted annotation',
      imageCount: 245,
      annotationCount: 1847,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      lastModified: '2024-01-15',
      collaborators: [
        { id: '1', name: 'Dr. Smith', email: 'smith@example.com', role: 'admin' as const },
        { id: '2', name: 'Dr. Chen', email: 'chen@example.com', role: 'annotator' as const },
        { id: '3', name: 'Dr. Rodriguez', email: 'rodriguez@example.com', role: 'reviewer' as const }
      ],
      owner: { id: '1', name: 'Dr. Smith', email: 'smith@example.com', role: 'admin' as const },
      status: 'active',
      aiSuggestions: 156
    },
    {
      id: '2',
      name: 'Lung Nodule Detection',
      description: 'CT chest scans for early-stage lung cancer detection with collaborative annotation',
      imageCount: 189,
      annotationCount: 2341,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14',
      lastModified: '2024-01-14',
      collaborators: [
        { id: '4', name: 'Dr. Wilson', email: 'wilson@example.com', role: 'admin' as const },
        { id: '5', name: 'Dr. Kumar', email: 'kumar@example.com', role: 'annotator' as const }
      ],
      owner: { id: '4', name: 'Dr. Wilson', email: 'wilson@example.com', role: 'admin' as const },
      status: 'active',
      aiSuggestions: 203
    },
    {
      id: '3',
      name: 'Cardiac Imaging Study',
      description: 'Echocardiogram analysis for cardiac function assessment',
      imageCount: 156,
      annotationCount: 892,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12',
      lastModified: '2024-01-12',
      collaborators: [
        { id: '6', name: 'Dr. Johnson', email: 'johnson@example.com', role: 'admin' as const },
        { id: '7', name: 'Dr. Lee', email: 'lee@example.com', role: 'annotator' as const },
        { id: '8', name: 'Dr. Brown', email: 'brown@example.com', role: 'reviewer' as const },
        { id: '9', name: 'Dr. Davis', email: 'davis@example.com', role: 'annotator' as const }
      ],
      owner: { id: '6', name: 'Dr. Johnson', email: 'johnson@example.com', role: 'admin' as const },
      status: 'completed',
      aiSuggestions: 78
    }
  ];

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value="24"
          change="+3 this month"
          icon={BarChart3}
          trend="up"
        />
        <StatsCard
          title="Images Annotated"
          value="15,847"
          change="+1,234 this week"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="AI Suggestions"
          value="4,567"
          change="89% accuracy"
          icon={Zap}
          trend="neutral"
        />
        <StatsCard
          title="Active Collaborators"
          value="12"
          change="3 online now"
          icon={Users}
          trend="neutral"
        />
      </div>

      {/* Project Management Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Projects</h2>
          <p className="text-slate-400">Manage and collaborate on medical imaging projects</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 w-64"
            />
          </div>
          
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            viewMode={viewMode}
            onClick={() => onProjectSelect(project)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or create a new project.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
