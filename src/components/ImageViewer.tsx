
import { Annotation } from '../types';
import { useAnnotationTools } from '../hooks/useAnnotationTools';
import { useImageViewer } from '../hooks/useImageViewer';
import ImageViewerControls from './ImageViewerControls';
import ImageCanvas from './ImageCanvas';
import ImageViewerStats from './ImageViewerStats';

interface ImageViewerProps {
  selectedTool: string;
  aiAnnotations?: Annotation[];
  uploadedImage?: string;
  uploadedImageName?: string;
  zoom?: number;
  showHeatmap?: boolean;
  gridVisible?: boolean;
  onZoomChange?: (zoom: number) => void;
  hideControls?: boolean;
}

const ImageViewer = ({ 
  selectedTool, 
  aiAnnotations = [], 
  uploadedImage, 
  uploadedImageName,
  zoom: externalZoom,
  showHeatmap: externalShowHeatmap,
  gridVisible: externalGridVisible,
  onZoomChange,
  hideControls = false
}: ImageViewerProps) => {
  const { annotations, drawingState } = useAnnotationTools();
  
  const {
    zoom,
    showHeatmap,
    gridVisible,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleToggleHeatmap,
    handleToggleGrid
  } = useImageViewer({
    externalZoom,
    externalShowHeatmap,
    externalGridVisible,
    onZoomChange
  });

  const allAnnotations = [...annotations, ...aiAnnotations];

  console.log('ImageViewer render:', {
    selectedTool,
    annotationsCount: annotations.length,
    aiAnnotationsCount: aiAnnotations.length,
    drawingState,
    hideControls
  });

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950">
      <ImageViewerControls
        zoom={zoom}
        showHeatmap={showHeatmap}
        gridVisible={gridVisible}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleHeatmap={handleToggleHeatmap}
        onToggleGrid={handleToggleGrid}
        hideControls={hideControls}
      />

      {/* Tool info */}
      <div className="absolute top-1 md:top-2 right-1 md:right-2 z-20 bg-teal-900/95 backdrop-blur-lg rounded-lg p-1 md:p-2 border border-teal-700/50">
        <div className="text-teal-200 text-xs">
          <span className="hidden md:inline">Tool: </span>
          <span className="text-white capitalize">{selectedTool}</span>
          {drawingState.isDrawing && (
            <span className="text-cyan-400 ml-1 md:ml-2">Drawing...</span>
          )}
        </div>
      </div>

      {/* Main image container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-1 md:p-4">
        {uploadedImage ? (
          <ImageCanvas
            selectedTool={selectedTool}
            aiAnnotations={aiAnnotations}
            uploadedImage={uploadedImage}
            uploadedImageName={uploadedImageName || ''}
            zoom={zoom}
            showHeatmap={showHeatmap}
          />
        ) : (
          <div className="text-center text-teal-300 p-2 md:p-4">
            <div className="bg-teal-800/50 rounded-lg p-4 md:p-8 border-2 border-dashed border-teal-600">
              <p className="text-sm md:text-lg mb-1 md:mb-2">No image uploaded</p>
              <p className="text-xs md:text-sm">Upload an image to start annotating</p>
            </div>
          </div>
        )}
      </div>

      <ImageViewerStats
        annotations={annotations}
        aiAnnotations={aiAnnotations}
        uploadedImage={uploadedImage}
        zoom={zoom}
      />
    </div>
  );
};

export default ImageViewer;
