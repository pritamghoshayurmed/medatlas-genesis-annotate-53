
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
    <div className="bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 px-2 md:px-4 py-1">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2 md:space-x-4">
          <span>Total: {metrics.total}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-yellow-400">AI: {metrics.aiGenerated}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-green-400">Manual: {metrics.manual}</span>
        </div>
        <div className="flex items-center space-x-2">
          {metrics.avgConfidence > 0 && (
            <span className="text-teal-400 hidden md:inline">Conf: {metrics.avgConfidence}%</span>
          )}
          {uploadedImage && (
            <span className="text-slate-400">
              {isMobile ? zoom + '%' : `Zoom: ${zoom}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewerStats;
