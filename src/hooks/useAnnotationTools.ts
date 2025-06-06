
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
    if (!drawingState.isDrawing) return;

    setDrawingState(prev => {
      if (tool === 'freehand') {
        // Add every point for smooth freehand drawing
        return {
          ...prev,
          currentPath: [...prev.currentPath, point]
        };
      } else if (tool === 'spline') {
        // Add points with some spacing for spline
        const lastPoint = prev.currentPath[prev.currentPath.length - 1];
        const distance = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
        );
        
        if (distance > 10 && prev.currentPath.length < 20) {
          return {
            ...prev,
            currentPath: [...prev.currentPath, point]
          };
        }
      }
      return prev;
    });
  }, [drawingState.isDrawing]);

  const finishDrawing = useCallback((tool: string) => {
    if (!drawingState.isDrawing || drawingState.currentPath.length === 0) {
      console.log('Cannot finish drawing - not drawing or no path');
      return;
    }

    console.log('Finishing drawing with', drawingState.currentPath.length, 'points');

    // Map tool types to valid annotation types
    let annotationType: 'polygon' | 'rectangle' | 'brush';
    if (tool === 'spline') {
      annotationType = 'polygon';
    } else {
      annotationType = 'brush';
    }

    const newAnnotation: Annotation = {
      id: `manual_${Date.now()}`,
      type: annotationType,
      coordinates: drawingState.currentPath.map(p => [p.x, p.y]),
      label: `Manual ${tool} annotation`,
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString()
    };

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
    console.log('Adding measurement:', distance.toFixed(1), 'px');
    
    const measurementAnnotation: Annotation = {
      id: `measure_${Date.now()}`,
      type: 'rectangle',
      coordinates: [[start.x, start.y], [end.x, end.y]],
      label: `Measurement: ${distance.toFixed(1)}px`,
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, measurementAnnotation]);
    
    setDrawingState({
      isDrawing: false,
      currentPath: [],
      startPoint: null
    });
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  }, []);

  const clearAllAnnotations = useCallback(() => {
    setAnnotations([]);
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
