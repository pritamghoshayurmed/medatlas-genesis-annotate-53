
import { Annotation } from '../types';

export interface AnnotationTool {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export const generateHeatmapPoints = (imageWidth: number, imageHeight: number, annotations: Annotation[]) => {
  const points = [];
  
  // Generate points based on AI annotations
  annotations.forEach(annotation => {
    if (annotation.coordinates && annotation.coordinates.length > 0) {
      const centerX = annotation.coordinates.reduce((sum, coord) => sum + coord[0], 0) / annotation.coordinates.length;
      const centerY = annotation.coordinates.reduce((sum, coord) => sum + coord[1], 0) / annotation.coordinates.length;
      
      // Add main point
      points.push({
        x: centerX,
        y: centerY,
        intensity: annotation.confidence || 0.8,
        region: annotation.label || 'Unknown',
        color: getColorForLabel(annotation.label || 'Unknown')
      });

      // Add surrounding points for better heatmap effect
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI;
        const distance = 20 + Math.random() * 30;
        const intensity = (annotation.confidence || 0.8) * (0.3 + Math.random() * 0.4);
        
        points.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          intensity,
          region: annotation.label || 'Unknown',
          color: getColorForLabel(annotation.label || 'Unknown')
        });
      }
    }
  });

  return points;
};

export const getColorForLabel = (label: string): string => {
  const colorMap: { [key: string]: string } = {
    'Glioblastoma': '#ef4444',
    'Peritumoral Edema': '#f59e0b',
    'Brain': '#3b82f6',
    'Ventricles': '#06b6d4',
    'Cerebellum': '#10b981',
    'Frontal Cortex': '#8b5cf6',
    'Parietal Cortex': '#ec4899',
    'Temporal Cortex': '#f97316',
    'Occipital Cortex': '#84cc16',
    'Hippocampus': '#06b6d4',
    'Amygdala': '#f59e0b',
    'Brainstem': '#6366f1'
  };
  
  return colorMap[label] || '#64748b';
};

export const calculateAnnotationMetrics = (annotations: Annotation[]) => {
  const total = annotations.length;
  const aiGenerated = annotations.filter(ann => ann.isAIGenerated).length;
  const manual = total - aiGenerated;
  const avgConfidence = annotations.reduce((sum, ann) => sum + (ann.confidence || 0), 0) / total;

  return {
    total,
    aiGenerated,
    manual,
    avgConfidence: Math.round(avgConfidence * 100)
  };
};
