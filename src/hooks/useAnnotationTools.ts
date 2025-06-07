
import { useState, useCallback } from 'react';
import { Annotation } from '../types';

export interface DrawingState {
  isDrawing: boolean;
  currentPath: { x: number; y: number }[];
  startPoint: { x: number; y: number } | null;
}

export const useAnnotationTools = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentPath: [],
    startPoint: null
  });

  const startDrawing = useCallback((point: { x: number; y: number }, tool: string) => {
    console.log('Starting drawing with tool:', tool, 'at point:', point);
    setDrawingState({
      isDrawing: true,
      currentPath: [point],
      startPoint: point
    });
  }, []);

  const updateDrawing = useCallback((point: { x: number; y: number }, tool: string) => {
    if (!drawingState.isDrawing) {
      console.log('Not drawing, skipping update');
      return;
    }

    setDrawingState(prev => {
      if (tool === 'freehand') {
        // Add every point for smooth freehand drawing
        const newPath = [...prev.currentPath, point];
        console.log('Updated freehand path, points:', newPath.length);
        return {
          ...prev,
          currentPath: newPath
        };
      } else if (tool === 'spline') {
        // Add points with some spacing for spline
        const lastPoint = prev.currentPath[prev.currentPath.length - 1];
        const distance = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
        );
        
        if (distance > 10 && prev.currentPath.length < 20) {
          const newPath = [...prev.currentPath, point];
          console.log('Updated spline path, points:', newPath.length);
          return {
            ...prev,
            currentPath: newPath
          };
        }
      }
      return prev;
    });
  }, [drawingState.isDrawing]);

  const finishDrawing = useCallback((tool: string) => {
    if (!drawingState.isDrawing || drawingState.currentPath.length === 0) {
      console.log('Cannot finish drawing - not drawing or no path');
      setDrawingState({
        isDrawing: false,
        currentPath: [],
        startPoint: null
      });
      return;
    }

    console.log('Finishing drawing with', drawingState.currentPath.length, 'points for tool:', tool);

    // Map tool types to valid annotation types
    let annotationType: 'polygon' | 'rectangle' | 'brush';
    if (tool === 'spline') {
      annotationType = 'polygon';
    } else {
      annotationType = 'brush';
    }

    const newAnnotation: Annotation = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: annotationType,
      coordinates: drawingState.currentPath.map(p => [p.x, p.y]),
      label: `Manual ${tool} annotation`,
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString(),
      color: '#10b981' // emerald-500
    };

    console.log('Created new annotation:', newAnnotation);

    setAnnotations(prev => {
      const updated = [...prev, newAnnotation];
      console.log('Added new annotation. Total annotations:', updated.length);
      return updated;
    });
    
    setDrawingState({
      isDrawing: false,
      currentPath: [],
      startPoint: null
    });
  }, [drawingState]);

  const addMeasurement = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    console.log('Adding measurement:', distance.toFixed(1), 'px from', start, 'to', end);
    
    const measurementAnnotation: Annotation = {
      id: `measure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'rectangle',
      coordinates: [[start.x, start.y], [end.x, end.y]],
      label: `Measurement: ${distance.toFixed(1)}px`,
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString(),
      color: '#06b6d4' // cyan-500
    };

    console.log('Created measurement annotation:', measurementAnnotation);

    setAnnotations(prev => {
      const updated = [...prev, measurementAnnotation];
      console.log('Added measurement. Total annotations:', updated.length);
      return updated;
    });
    
    setDrawingState({
      isDrawing: false,
      currentPath: [],
      startPoint: null
    });
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    console.log('Deleting annotation:', id);
    setAnnotations(prev => {
      const updated = prev.filter(ann => ann.id !== id);
      console.log('Deleted annotation. Remaining annotations:', updated.length);
      return updated;
    });
  }, []);

  const clearAllAnnotations = useCallback(() => {
    console.log('Clearing all annotations');
    setAnnotations([]);
    setDrawingState({
      isDrawing: false,
      currentPath: [],
      startPoint: null
    });
  }, []);

  return {
    annotations,
    setAnnotations,
    drawingState,
    startDrawing,
    updateDrawing,
    finishDrawing,
    addMeasurement,
    deleteAnnotation,
    clearAllAnnotations
  };
};
