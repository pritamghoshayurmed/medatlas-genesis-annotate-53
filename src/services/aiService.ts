
import { Annotation } from '../types';
import { generateAIAnnotationsForImage } from '../utils/annotationUtils';

export const generateAIAnnotations = async (
  imageFile: File,
  imageWidth?: number,
  imageHeight?: number
): Promise<Annotation[]> => {
  console.log('Starting AI annotation generation for image:', imageFile.name);
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Use provided dimensions or default values
  const width = imageWidth || 800;
  const height = imageHeight || 600;
  
  console.log('Generating AI annotations for image dimensions:', { width, height });
  
  // Generate random annotations across the entire image
  const annotations = generateAIAnnotationsForImage(width, height);
  
  console.log('AI annotation generation completed:', annotations.length, 'annotations generated');
  
  return annotations;
};

export const runSegmentation = async (imageUrl: string, imageWidth: number, imageHeight: number): Promise<Annotation[]> => {
  console.log('Running AI segmentation on image with dimensions:', { imageWidth, imageHeight });
  
  // Simulate MONAI processing time
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
  // Generate random annotations distributed across the entire image area
  const segmentationResults = generateAIAnnotationsForImage(imageWidth, imageHeight);
  
  console.log('Segmentation completed with', segmentationResults.length, 'regions identified');
  
  return segmentationResults;
};
