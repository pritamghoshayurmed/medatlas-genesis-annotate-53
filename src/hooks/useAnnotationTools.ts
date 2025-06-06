
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
    setDrawingState({
      isDrawing: true,
      currentPath: [point],
      startPoint: point
    });
  }, []);

  const updateDrawing = useCallback((point: { x: number; y: number }, tool: string) => {
    if (!drawingState.isDrawing) return;

    if (tool === 'freehand') {
      setDrawingState(prev => ({
        ...prev,
        currentPath: [...prev.currentPath, point]
      }));
    } else if (tool === 'spline' && drawingState.currentPath.length < 10) {
      setDrawingState(prev => ({
        ...prev,
        currentPath: [...prev.currentPath, point]
      }));
    }
  }, [drawingState.isDrawing, drawingState.currentPath.length]);

  const finishDrawing = useCallback((tool: string) => {
    if (!drawingState.isDrawing || drawingState.currentPath.length === 0) return;

    const newAnnotation: Annotation = {
      id: `manual_${Date.now()}`,
      type: tool === 'spline' ? 'spline' : 'freehand',
      coordinates: drawingState.currentPath.map(p => [p.x, p.y]),
      label: 'Manual Annotation',
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setDrawingState({
      isDrawing: false,
      currentPath: [],
      startPoint: null
    });
  }, [drawingState]);

  const addMeasurement = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const measurementAnnotation: Annotation = {
      id: `measure_${Date.now()}`,
      type: 'measurement',
      coordinates: [[start.x, start.y], [end.x, end.y]],
      label: `${distance.toFixed(1)}px`,
      confidence: 1.0,
      isAIGenerated: false,
      author: 'User',
      timestamp: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, measurementAnnotation]);
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
