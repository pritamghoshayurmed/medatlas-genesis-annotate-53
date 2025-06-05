
import { MedicalImage, Annotation } from '../types';

// Mock MONAI Backend Service
export class MockMonaiBackend {
  private static instance: MockMonaiBackend;
  private processingQueue: Map<string, any> = new Map();

  static getInstance(): MockMonaiBackend {
    if (!MockMonaiBackend.instance) {
      MockMonaiBackend.instance = new MockMonaiBackend();
    }
    return MockMonaiBackend.instance;
  }

  // Simulate MONAI's medical image loading and preprocessing
  async loadMedicalImage(imageId: string): Promise<MedicalImage> {
    console.log(`MONAI Backend: Loading medical image ${imageId}`);
    
    // Simulate network delay
    await this.simulateDelay(800);
    
    const mockImage: MedicalImage = {
      id: imageId,
      name: `brain_scan_${imageId}.dcm`,
      url: '/placeholder.svg',
      annotations: [],
      dimensions: { width: 1024, height: 1024 },
      metadata: {
        patientId: `PT_${Math.random().toString(36).substr(2, 9)}`,
        studyDate: new Date().toISOString().split('T')[0],
        modality: 'MRI'
      }
    };

    console.log('MONAI Backend: Image loaded successfully', mockImage);
    return mockImage;
  }

  // Simulate MONAI's AI segmentation models
  async runSegmentation(imageId: string, modelType: string = 'brain_tumor'): Promise<{
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
  }> {
    const jobId = `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`MONAI Backend: Starting ${modelType} segmentation for image ${imageId}`);
    console.log(`MONAI Backend: Job ID ${jobId} created`);

    // Add to processing queue
    this.processingQueue.set(jobId, {
      imageId,
      modelType,
      status: 'processing',
      progress: 0,
      startTime: Date.now()
    });

    // Simulate progressive processing
    this.simulateSegmentationProgress(jobId);

    return {
      jobId,
      status: 'processing',
      progress: 0
    };
  }

  // Simulate progressive AI processing like MONAI's inference pipeline
  private async simulateSegmentationProgress(jobId: string) {
    const job = this.processingQueue.get(jobId);
    if (!job) return;

    const steps = [
      { progress: 15, message: 'Preprocessing medical image...' },
      { progress: 30, message: 'Loading segmentation model...' },
      { progress: 50, message: 'Running inference...' },
      { progress: 75, message: 'Post-processing results...' },
      { progress: 90, message: 'Generating annotations...' },
      { progress: 100, message: 'Segmentation completed' }
    ];

    for (const step of steps) {
      await this.simulateDelay(500 + Math.random() * 1000);
      job.progress = step.progress;
      console.log(`MONAI Backend: ${step.message} (${step.progress}%)`);
      
      if (step.progress === 100) {
        job.status = 'completed';
        job.results = this.generateMockSegmentationResults(job.modelType);
      }
    }
  }

  // Get job status (like MONAI's job monitoring)
  async getJobStatus(jobId: string): Promise<any> {
    const job = this.processingQueue.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return {
      jobId,
      status: job.status,
      progress: job.progress,
      results: job.results || null,
      startTime: job.startTime,
      modelType: job.modelType
    };
  }

  // Generate mock segmentation results that mimic MONAI's output format
  private generateMockSegmentationResults(modelType: string): Annotation[] {
    const baseAnnotations: Annotation[] = [];

    switch (modelType) {
      case 'brain_tumor':
        baseAnnotations.push({
          id: `ann_${Date.now()}_1`,
          type: 'polygon',
          coordinates: this.generateTumorCoordinates(),
          label: 'Glioblastoma',
          confidence: 0.89,
          isAIGenerated: true,
          author: 'MONAI-AI',
          timestamp: new Date().toISOString()
        });
        baseAnnotations.push({
          id: `ann_${Date.now()}_2`,
          type: 'polygon',
          coordinates: this.generateEdemmaCoordinates(),
          label: 'Peritumoral Edema',
          confidence: 0.72,
          isAIGenerated: true,
          author: 'MONAI-AI',
          timestamp: new Date().toISOString()
        });
        break;
      
      case 'organ_segmentation':
        ['Brain', 'Ventricles', 'Cerebellum'].forEach((organ, index) => {
          baseAnnotations.push({
            id: `ann_${Date.now()}_${index + 1}`,
            type: 'polygon',
            coordinates: this.generateOrganCoordinates(index),
            label: organ,
            confidence: 0.85 + Math.random() * 0.1,
            isAIGenerated: true,
            author: 'MONAI-AI',
            timestamp: new Date().toISOString()
          });
        });
        break;
    }

    return baseAnnotations;
  }

  // Generate realistic tumor coordinates
  private generateTumorCoordinates(): number[][] {
    const centerX = 200 + Math.random() * 200;
    const centerY = 200 + Math.random() * 200;
    const radius = 30 + Math.random() * 40;
    
    const coordinates: number[][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      const variance = 0.8 + Math.random() * 0.4; // Make it irregular
      coordinates.push([
        centerX + Math.cos(angle) * radius * variance,
        centerY + Math.sin(angle) * radius * variance
      ]);
    }
    return coordinates;
  }

  // Generate edema coordinates around tumor
  private generateEdemmaCoordinates(): number[][] {
    const centerX = 220 + Math.random() * 160;
    const centerY = 220 + Math.random() * 160;
    const radius = 60 + Math.random() * 30;
    
    const coordinates: number[][] = [];
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * 2 * Math.PI;
      const variance = 0.7 + Math.random() * 0.6;
      coordinates.push([
        centerX + Math.cos(angle) * radius * variance,
        centerY + Math.sin(angle) * radius * variance
      ]);
    }
    return coordinates;
  }

  // Generate organ segmentation coordinates
  private generateOrganCoordinates(organIndex: number): number[][] {
    const centers = [
      { x: 300, y: 300 }, // Brain
      { x: 250, y: 350 }, // Ventricles
      { x: 300, y: 450 }  // Cerebellum
    ];
    
    const center = centers[organIndex];
    const radius = [120, 40, 60][organIndex];
    
    const coordinates: number[][] = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * 2 * Math.PI;
      coordinates.push([
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius
      ]);
    }
    return coordinates;
  }

  // Simulate MONAI's model inference capabilities
  async getAvailableModels(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    accuracy: number;
    modality: string[];
  }>> {
    await this.simulateDelay(300);
    
    return [
      {
        id: 'brain_tumor',
        name: 'Brain Tumor Segmentation',
        description: 'MONAI model for detecting and segmenting brain tumors in MRI scans',
        accuracy: 0.89,
        modality: ['MRI', 'CT']
      },
      {
        id: 'organ_segmentation',
        name: 'Multi-Organ Segmentation',
        description: 'MONAI model for segmenting multiple organs and anatomical structures',
        accuracy: 0.92,
        modality: ['MRI', 'CT']
      },
      {
        id: 'lesion_detection',
        name: 'Lesion Detection',
        description: 'MONAI model for detecting various types of lesions',
        accuracy: 0.86,
        modality: ['MRI', 'CT', 'PET']
      }
    ];
  }

  // Simulate image preprocessing like MONAI's transforms
  async preprocessImage(imageId: string, transforms: string[]): Promise<{
    processedImageId: string;
    appliedTransforms: string[];
  }> {
    console.log(`MONAI Backend: Preprocessing image ${imageId} with transforms:`, transforms);
    await this.simulateDelay(1000);
    
    return {
      processedImageId: `processed_${imageId}`,
      appliedTransforms: transforms
    };
  }

  // Simulate MONAI's metrics calculation
  async calculateMetrics(groundTruthAnnotations: Annotation[], predictedAnnotations: Annotation[]): Promise<{
    diceScore: number;
    hausdorffDistance: number;
    sensitivity: number;
    specificity: number;
  }> {
    await this.simulateDelay(500);
    
    return {
      diceScore: 0.85 + Math.random() * 0.1,
      hausdorffDistance: 2.3 + Math.random() * 1.5,
      sensitivity: 0.88 + Math.random() * 0.08,
      specificity: 0.91 + Math.random() * 0.06
    };
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const monaiBackend = MockMonaiBackend.getInstance();
