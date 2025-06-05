
export interface Project {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  annotationCount: number;
  lastModified: string;
  collaborators: string[];
  status: 'active' | 'completed' | 'archived';
  aiSuggestions: number;
}

export interface Annotation {
  id: string;
  type: 'polygon' | 'rectangle' | 'brush';
  coordinates: number[][];
  label: string;
  confidence?: number;
  isAIGenerated: boolean;
  author: string;
  timestamp: string;
}

export interface MedicalImage {
  id: string;
  name: string;
  url: string;
  annotations: Annotation[];
  dimensions: { width: number; height: number };
  metadata: {
    patientId?: string;
    studyDate?: string;
    modality?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'researcher' | 'reviewer' | 'guest';
  avatar?: string;
  isOnline: boolean;
}
