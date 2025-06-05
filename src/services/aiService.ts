
import { monaiBackend } from './mockMonaiBackend';
import { Annotation } from '../types';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  modality: string[];
}

export interface SegmentationJob {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  results?: Annotation[];
  startTime?: number;
  modelType?: string;
}

class AIService {
  private activeJobs: Map<string, SegmentationJob> = new Map();
  private jobCallbacks: Map<string, (job: SegmentationJob) => void> = new Map();

  async getAvailableModels(): Promise<AIModel[]> {
    try {
      const models = await monaiBackend.getAvailableModels();
      console.log('AI Service: Available models loaded', models);
      return models;
    } catch (error) {
      console.error('AI Service: Failed to load models', error);
      throw error;
    }
  }

  async startSegmentation(imageId: string, modelId: string, onProgress?: (job: SegmentationJob) => void): Promise<string> {
    try {
      console.log(`AI Service: Starting segmentation with model ${modelId} for image ${imageId}`);
      
      const result = await monaiBackend.runSegmentation(imageId, modelId);
      const job: SegmentationJob = {
        jobId: result.jobId,
        status: result.status,
        progress: result.progress
      };

      this.activeJobs.set(result.jobId, job);
      
      if (onProgress) {
        this.jobCallbacks.set(result.jobId, onProgress);
        this.monitorJob(result.jobId);
      }

      return result.jobId;
    } catch (error) {
      console.error('AI Service: Failed to start segmentation', error);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<SegmentationJob> {
    try {
      const status = await monaiBackend.getJobStatus(jobId);
      const job: SegmentationJob = {
        jobId: status.jobId,
        status: status.status,
        progress: status.progress,
        results: status.results,
        startTime: status.startTime,
        modelType: status.modelType
      };

      this.activeJobs.set(jobId, job);
      return job;
    } catch (error) {
      console.error(`AI Service: Failed to get status for job ${jobId}`, error);
      throw error;
    }
  }

  private async monitorJob(jobId: string) {
    const callback = this.jobCallbacks.get(jobId);
    if (!callback) return;

    const checkStatus = async () => {
      try {
        const job = await this.getJobStatus(jobId);
        callback(job);

        if (job.status === 'processing') {
          setTimeout(checkStatus, 1000); // Check every second
        } else {
          this.jobCallbacks.delete(jobId);
          console.log(`AI Service: Job ${jobId} monitoring completed`);
        }
      } catch (error) {
        console.error(`AI Service: Error monitoring job ${jobId}`, error);
        this.jobCallbacks.delete(jobId);
      }
    };

    setTimeout(checkStatus, 1000);
  }

  async calculateMetrics(groundTruth: Annotation[], predicted: Annotation[]) {
    try {
      const metrics = await monaiBackend.calculateMetrics(groundTruth, predicted);
      console.log('AI Service: Metrics calculated', metrics);
      return metrics;
    } catch (error) {
      console.error('AI Service: Failed to calculate metrics', error);
      throw error;
    }
  }

  getActiveJobs(): SegmentationJob[] {
    return Array.from(this.activeJobs.values());
  }

  cancelJob(jobId: string): void {
    this.activeJobs.delete(jobId);
    this.jobCallbacks.delete(jobId);
    console.log(`AI Service: Job ${jobId} cancelled`);
  }
}

export const aiService = new AIService();
