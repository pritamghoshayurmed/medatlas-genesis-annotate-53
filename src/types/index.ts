export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'annotator' | 'reviewer';
  isOnline?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  annotationCount: number;
  createdAt: string;
  updatedAt: string;
  lastModified: string; // Added missing property
  status: 'active' | 'completed' | 'archived';
  collaborators: User[];
  owner: User;
  aiSuggestions: number; // Added missing property
}

export interface Annotation {
  id: string;
  type: 'polygon' | 'rectangle' | 'brush' | 'point';
  coordinates: number[][];
  label?: string;
  confidence?: number;
  isAIGenerated: boolean;
  author: string;
  timestamp: string;
  color?: string; // Added color property for annotations
}

export interface MedicalImage {
  id: string;
  filename: string;
  url: string;
  metadata: {
    modality: string;
    bodyPart: string;
    studyDate: string;
    patientId?: string;
    dimensions: {
      width: number;
      height: number;
      depth?: number;
    };
  };
  annotations: Annotation[];
  uploadedAt: string;
  uploadedBy: User;
}

export interface AnnotationLayer {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  opacity: number;
  annotations: Annotation[];
}

export interface WorkspaceSettings {
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  defaultTool: string;
  autoSave: boolean;
  shortcuts: Record<string, string>;
}
