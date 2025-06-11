import { Annotation } from '../types';

export const generateHeatmapPoints = (
  imageWidth: number,
  imageHeight: number,
  annotations: Annotation[]
) => {
  const points: { x: number; y: number; intensity: number; region: string; color: string }[] = [];
  
  annotations.forEach(annotation => {
    if (annotation.coordinates && annotation.coordinates.length > 0) {
      // Add multiple points around each annotation for better heatmap visualization
      annotation.coordinates.forEach(coord => {
        const [x, y] = coord;
        const intensity = annotation.confidence || 0.5;
        const region = annotation.label || 'Unknown';
        const color = annotation.color || '#fbbf24';
        
        // Add the main point
        points.push({ x, y, intensity, region, color });
        
        // Add surrounding points for better heat effect
        const radius = 20;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          
          points.push({
            x: Math.max(0, Math.min(imageWidth, x + offsetX)),
            y: Math.max(0, Math.min(imageHeight, y + offsetY)),
            intensity: intensity * 0.3,
            region,
            color
          });
        }
      });
    }
  });

  return points;
};

export const calculateAnnotationMetrics = (annotations: Annotation[]) => {
  const total = annotations.length;
  const aiGenerated = annotations.filter(a => a.isAIGenerated).length;
  const manual = total - aiGenerated;
  
  const confidenceValues = annotations
    .filter(a => a.confidence !== undefined)
    .map(a => a.confidence || 0);
  
  const avgConfidence = confidenceValues.length > 0 
    ? Math.round((confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length) * 100)
    : 0;

  return {
    total,
    aiGenerated,
    manual,
    avgConfidence
  };
};

export const generateRandomAIAnnotations = (imageWidth: number, imageHeight: number, count: number = 3): Annotation[] => {
  const annotations: Annotation[] = [];
  const labels = [
    'Tumor Region',
    'Anomalous Tissue', 
    'Suspicious Area',
    'Lesion',
    'Glioblastoma',
    'Peritumoral Edema',
    'Enhancement Region',
    'Hemorrhage',
    'Necrosis',
    'White Matter',
    'Gray Matter',
    'Cerebral Cortex'
  ];

  const colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'];

  for (let i = 0; i < count; i++) {
    // Generate completely random positions across the entire image
    const centerX = Math.random() * imageWidth;
    const centerY = Math.random() * imageHeight;
    
    // Generate random shape type
    const shapeType = Math.random() < 0.5 ? 'polygon' : 'rectangle';
    
    let coordinates: number[][];
    
    if (shapeType === 'polygon') {
      // Generate a random polygon with 4-8 points
      const numPoints = 4 + Math.floor(Math.random() * 5);
      const radius = 20 + Math.random() * 60; // Random size between 20-80px
      coordinates = [];
      
      for (let j = 0; j < numPoints; j++) {
        const angle = (j * Math.PI * 2) / numPoints + (Math.random() - 0.5) * 0.8;
        const pointRadius = radius * (0.7 + Math.random() * 0.6); // Vary the radius for irregular shape
        
        const x = Math.max(10, Math.min(imageWidth - 10, centerX + Math.cos(angle) * pointRadius));
        const y = Math.max(10, Math.min(imageHeight - 10, centerY + Math.sin(angle) * pointRadius));
        
        coordinates.push([x, y]);
      }
    } else {
      // Generate a random rectangle
      const width = 30 + Math.random() * 80;
      const height = 30 + Math.random() * 80;
      
      const x1 = Math.max(10, Math.min(imageWidth - width - 10, centerX - width / 2));
      const y1 = Math.max(10, Math.min(imageHeight - height - 10, centerY - height / 2));
      const x2 = x1 + width;
      const y2 = y1 + height;
      
      coordinates = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    }

    const label = labels[Math.floor(Math.random() * labels.length)];
    const confidence = 0.7 + Math.random() * 0.3; // Between 70-100%
    const color = colors[Math.floor(Math.random() * colors.length)];

    annotations.push({
      id: `ai_random_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      type: shapeType,
      coordinates,
      label,
      confidence,
      isAIGenerated: true,
      author: 'MONAI',
      timestamp: new Date().toISOString(),
      color
    });
  }

  console.log('Generated random AI annotations:', annotations);
  return annotations;
};

export const generateAIAnnotationsForImage = (imageWidth: number, imageHeight: number): Annotation[] => {
  // Generate 2-5 random annotations across the image
  const annotationCount = 2 + Math.floor(Math.random() * 4);
  return generateRandomAIAnnotations(imageWidth, imageHeight, annotationCount);
};
