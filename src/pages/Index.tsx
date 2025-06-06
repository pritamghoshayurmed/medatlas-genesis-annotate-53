
import { useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import AnnotationWorkspace from '../components/AnnotationWorkspace';
import { Project } from '../types';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'annotation'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setActiveView('annotation');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        activeView={activeView} 
        onBackToDashboard={handleBackToDashboard}
        selectedProject={selectedProject}
      />
      
      {activeView === 'dashboard' ? (
        <Dashboard onProjectSelect={handleProjectSelect} />
      ) : (
        <AnnotationWorkspace 
          project={selectedProject!}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
};

export default Index;
