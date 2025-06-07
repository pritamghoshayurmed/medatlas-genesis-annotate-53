
import { Annotation } from '../types';

// Mock MONAI backend service for generating AI annotations
export const generateAIAnnotations = async (imageUrl: string): Promise<Annotation[]> => {
  console.log('Generating AI annotations for image:', imageUrl);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock annotations with realistic medical regions
  const mockAnnotations: Annotation[] = [
    {
      id: `ai_glioblastoma_${Date.now()}`,
      type: 'polygon',
      coordinates: [
        [120, 80], [180, 85], [190, 120], [185, 160], [150, 165], [110, 140], [105, 100]
      ],
      label: 'Glioblastoma',
      confidence: 0.92,
      isAIGenerated: true,
      author: 'MONAI AI',
      timestamp: new Date().toISOString(),
      color: '#ef4444' // red for tumor
    },
    {
      id: `ai_edema_${Date.now() + 1}`,
      type: 'polygon',
      coordinates: [
        [200, 120], [260, 115], [280, 140], [275, 180], [240, 190], [210, 170], [195, 145]
      ],
      label: 'Peritumoral Edema',
      confidence: 0.87,
      isAIGenerated: true,
      author: 'MONAI AI',
      timestamp: new Date().toISOString(),
      color: '#f59e0b' // amber for edema
    },
    {
      id: `ai_ventricle_${Date.now() + 2}`,
      type: 'polygon',
      coordinates: [
        [300, 180], [340, 175], [350, 200], [345, 220], [320, 225], [305, 210]
      ],
      label: 'Ventricles',
      confidence: 0.95,
      isAIGenerated: true,
      author: 'MONAI AI',
      timestamp: new Date().toISOString(),
      color: '#06b6d4' // cyan for ventricles
    },
    {
      id: `ai_cortex_${Date.now() + 3}`,
      type: 'polygon',
      coordinates: [
        [80, 200], [140, 195], [160, 220], [155, 250], [120, 260], [85, 245], [75, 220]
      ],
      label: 'Frontal Cortex',
      confidence: 0.89,
      isAIGenerated: true,
      author: 'MONAI AI',
      timestamp: new Date().toISOString(),
      color: '#8b5cf6' // purple for cortex
    }
  ];

  console.log('Generated mock AI annotations:', mockAnnotations);
  return mockAnnotations;
};

// Mock function to simulate MONAI model prediction
export const predictWithMonai = async (imageData: string): Promise<{
  annotations: Annotation[];
  confidence: number;
  processingTime: number;
}> => {
  console.log('Running MONAI prediction...');
  
  const startTime = Date.now();
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const annotations = await generateAIAnnotations(imageData);
  const processingTime = Date.now() - startTime;
  const avgConfidence = annotations.reduce((sum, ann) => sum + (ann.confidence || 0), 0) / annotations.length;

  return {
    annotations,
    confidence: avgConfidence,
    processingTime
  };
};

// Mock function to get available MONAI models
export const getAvailableModels = async () => {
  return [
    {
      id: 'brain_tumor_segmentation',
      name: 'Brain Tumor Segmentation',
      description: 'Segments glioblastoma and peritumoral edema in brain MRI',
      modality: 'MRI',
      bodyPart: 'Brain'
    },
    {
      id: 'lung_nodule_detection',
      name: 'Lung Nodule Detection',
      description: 'Detects and classifies lung nodules in CT scans',
      modality: 'CT',
      bodyPart: 'Chest'
    },
    {
      id: 'cardiac_segmentation',
      name: 'Cardiac Segmentation',
      description: 'Segments cardiac chambers and structures',
      modality: 'Echo',
      bodyPart: 'Heart'
    }
  ];
};

// Additional functions for aiService compatibility
const runSegmentation = async (imageId: string, modelId: string) => {
  console.log(`Running segmentation with model ${modelId} for image ${imageId}`);
  
  return {
    jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'processing' as const,
    progress: 0
  };
};

const getJobStatus = async (jobId: string) => {
  console.log(`Getting status for job ${jobId}`);
  
  // Simulate job completion
  const annotations = await generateAIAnnotations('mock-image');
  
  return {
    jobId,
    status: 'completed' as const,
    progress: 100,
    results: annotations,
    startTime: Date.now() - 3000,
    modelType: 'brain_tumor_segmentation'
  };
};

const calculateMetrics = async (groundTruth: Annotation[], predicted: Annotation[]) => {
  console.log('Calculating metrics between ground truth and predicted annotations');
  
  // Mock metrics calculation
  return {
    dice: 0.85,
    jaccard: 0.74,
    hausdorff: 2.3,
    sensitivity: 0.92,
    specificity: 0.88
  };
};

// Export the monaiBackend object that aiService expects
export const monaiBackend = {
  generateAIAnnotations,
  predictWithMonai,
  getAvailableModels,
  runSegmentation,
  getJobStatus,
  calculateMetrics
};
