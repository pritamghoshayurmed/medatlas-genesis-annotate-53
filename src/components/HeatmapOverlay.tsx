
import { useEffect, useRef } from 'react';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  region: string;
  color: string;
}

interface HeatmapOverlayProps {
  points: HeatmapPoint[];
  imageWidth: number;
  imageHeight: number;
  opacity?: number;
}

const HeatmapOverlay = ({ points, imageWidth, imageHeight, opacity = 0.6 }: HeatmapOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Clear canvas
    ctx.clearRect(0, 0, imageWidth, imageHeight);

    // Create heatmap
    points.forEach(point => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, 30 * point.intensity
      );
      
      const color = point.color || '#ff6b6b';
      gradient.addColorStop(0, `${color}${Math.round(point.intensity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.7, `${color}40`);
      gradient.addColorStop(1, `${color}00`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, imageWidth, imageHeight);
    });

    // Apply global opacity
    ctx.globalAlpha = opacity;
  }, [points, imageWidth, imageHeight, opacity]);

  if (points.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default HeatmapOverlay;
