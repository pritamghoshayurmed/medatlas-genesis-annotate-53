
import { Annotation } from '../types';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  modality: string[];
}

export interface SegmentationResult {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  results?: Annotation[];
  startTime?: number;
  modelType?: string;
}

class MockMonaiBackend {
  private models: AIModel[] = [
    {
      id: 'brain_tumor_seg',
      name: 'Brain Tumor Segmentation',
      description: 'MONAI model for brain tumor detection and segmentation',
      accuracy: 94.2,
      modality: ['MRI', 'CT']
    },
    {
      id: 'brain_anatomy_seg',
      name: 'Brain Anatomy Segmentation',
      description: 'Detailed brain structure segmentation',
      accuracy: 89.7,
      modality: ['MRI']
    },
    {
      id: 'lesion_detection',
      name: 'Lesion Detection',
      description: 'Multi-class lesion detection and classification',
      accuracy: 91.3,
      modality: ['MRI', 'CT', 'FLAIR']
    }
  ];

  private activeJobs: Map<string, SegmentationResult> = new Map();

  async getAvailableModels(): Promise<AIModel[]> {
    await this.delay(500);
    console.log('Mock MONAI Backend: Returning available models');
    return this.models;
  }

  private generateRandomAnnotations(imageWidth: number = 400, imageHeight: number = 400): Annotation[] {
    const annotations: Annotation[] = [];
    const regions = [
      { label: 'Glioblastoma', color: '#fbbf24', confidence: 0.89 },
      { label: 'Peritumoral Edema', color: '#f59e0b', confidence: 0.76 },
      { label: 'Brain Lesion', color: '#eab308', confidence: 0.82 },
      { label: 'Abnormal Region', color: '#facc15', confidence: 0.71 },
      { label: 'Highlighted Area', color: '#fde047', confidence: 0.93 }
    ];

    // Generate 3-7 random annotations
    const numAnnotations = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < numAnnotations; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      
      // Generate random blob-like shapes
      const centerX = Math.random() * (imageWidth * 0.6) + (imageWidth * 0.2);
      const centerY = Math.random() * (imageHeight * 0.6) + (imageHeight * 0.2);
      const size = 20 + Math.random() * 80;
      
      const coordinates: number[][] = [];
      const numPoints = 12 + Math.floor(Math.random() * 8);
      
      for (let j = 0; j < numPoints; j++) {
        const angle = (j / numPoints) * 2 * Math.PI;
        const radius = size * (0.7 + Math.random() * 0.6);
        const irregularity = Math.random() * 0.3 + 0.85;
        
        const x = centerX + Math.cos(angle) * radius * irregularity;
        const y = centerY + Math.sin(angle) * radius * irregularity;
        
        coordinates.push([
          Math.max(0, Math.min(imageWidth, x)),
          Math.max(0, Math.min(imageHeight, y))
        ]);
      }

      annotations.push({
        id: `ai_seg_${Date.now()}_${i}`,
        type: 'polygon',
        coordinates,
        label: region.label,
        confidence: region.confidence,
        isAIGenerated: true,
        author: 'MONAI AI',
        timestamp: new Date().toISOString(),
        color: region.color
      });
    }

    return annotations;
  }

  async runSegmentation(imageId: string, modelId: string): Promise<SegmentationResult> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Mock MONAI Backend: Starting segmentation job ${jobId}`);
    
    const job: SegmentationResult = {
      jobId,
      status: 'processing',
      progress: 0,
      startTime: Date.now(),
      modelType: modelId
    };

    this.activeJobs.set(jobId, job);

    // Simulate processing with progress updates
    setTimeout(() => {
      const updatedJob = this.activeJobs.get(jobId);
      if (updatedJob) {
        updatedJob.progress = 30;
        updatedJob.status = 'processing';
      }
    }, 1000);

    setTimeout(() => {
      const updatedJob = this.activeJobs.get(jobId);
      if (updatedJob) {
        updatedJob.progress = 65;
        updatedJob.status = 'processing';
      }
    }, 2500);

    setTimeout(() => {
      const updatedJob = this.activeJobs.get(jobId);
      if (updatedJob) {
        updatedJob.progress = 90;
        updatedJob.status = 'processing';
      }
    }, 4000);

    // Complete the job with random annotations
    setTimeout(() => {
      const updatedJob = this.activeJobs.get(jobId);
      if (updatedJob) {
        updatedJob.progress = 100;
        updatedJob.status = 'completed';
        updatedJob.results = this.generateRandomAnnotations();
        console.log(`Mock MONAI Backend: Job ${jobId} completed with ${updatedJob.results.length} annotations`);
      }
    }, 5500);

    return job;
  }

  async getJobStatus(jobId: string): Promise<SegmentationResult> {
    await this.delay(200);
    const job = this.activeJobs.get(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return { ...job };
  }

  async calculateMetrics(groundTruth: Annotation[], predicted: Annotation[]) {
    await this.delay(1000);
    
    const dice = 0.85 + Math.random() * 0.1;
    const iou = 0.75 + Math.random() * 0.15;
    const sensitivity = 0.80 + Math.random() * 0.15;
    const specificity = 0.90 + Math.random() * 0.08;
    
    return {
      dice: Math.round(dice * 100) / 100,
      iou: Math.round(iou * 100) / 100,
      sensitivity: Math.round(sensitivity * 100) / 100,
      specificity: Math.round(specificity * 100) / 100
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const monaiBackend = new MockMonaiBackend();
