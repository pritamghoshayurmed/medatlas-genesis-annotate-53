
import { useState, useEffect } from 'react';

interface UseImageViewerProps {
  externalZoom?: number;
  externalShowHeatmap?: boolean;
  externalGridVisible?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export const useImageViewer = ({
  externalZoom,
  externalShowHeatmap,
  externalGridVisible,
  onZoomChange
}: UseImageViewerProps) => {
  const [internalZoom, setInternalZoom] = useState(100);
  const [internalShowHeatmap, setInternalShowHeatmap] = useState(true);
  const [internalGridVisible, setInternalGridVisible] = useState(false);

  // Use external state if provided, otherwise use internal state
  const zoom = externalZoom !== undefined ? externalZoom : internalZoom;
  const showHeatmap = externalShowHeatmap !== undefined ? externalShowHeatmap : internalShowHeatmap;
  const gridVisible = externalGridVisible !== undefined ? externalGridVisible : internalGridVisible;

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 400);
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  const handleResetZoom = () => {
    if (onZoomChange) {
      onZoomChange(100);
    } else {
      setInternalZoom(100);
    }
  };

  const handleToggleHeatmap = () => {
    if (externalShowHeatmap === undefined) {
      setInternalShowHeatmap(!internalShowHeatmap);
    }
  };

  const handleToggleGrid = () => {
    if (externalGridVisible === undefined) {
      setInternalGridVisible(!internalGridVisible);
    }
  };

  return {
    zoom,
    showHeatmap,
    gridVisible,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleToggleHeatmap,
    handleToggleGrid
  };
};
