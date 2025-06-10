
import { calculateAnnotationMetrics } from '../utils/annotationUtils';
import { Annotation } from '../types';
import { useIsMobile } from '../hooks/use-mobile';

interface ImageViewerStatsProps {
  annotations: Annotation[];
  aiAnnotations: Annotation[];
  uploadedImage?: string;
  zoom: number;
}

const ImageViewerStats = ({ annotations, aiAnnotations, uploadedImage, zoom }: ImageViewerStatsProps) => {
  const isMobile = useIsMobile();
  const allAnnotations = [...annotations, ...aiAnnotations];
  const metrics = calculateAnnotationMetrics(allAnnotations);

  return (
    <div className="bg-teal-900/95 backdrop-blur-lg border-t border-teal-700/50 px-2 md:px-4 py-1">
      <div className="flex items-center justify-between text-xs text-teal-200">
        <div className="flex items-center space-x-2 md:space-x-4">
          <span>Total: {metrics.total}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-cyan-300">AI: {metrics.aiGenerated}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-teal-300">Manual: {metrics.manual}</span>
        </div>
        <div className="flex items-center space-x-2">
          {metrics.avgConfidence > 0 && (
            <span className="text-cyan-400 hidden md:inline">Conf: {metrics.avgConfidence}%</span>
          )}
          {uploadedImage && (
            <span className="text-teal-300">
              {isMobile ? zoom + '%' : `Zoom: ${zoom}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewerStats;
