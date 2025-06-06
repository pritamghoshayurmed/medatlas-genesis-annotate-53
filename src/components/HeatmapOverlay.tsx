
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

const HeatmapOverlay = ({ points, imageWidth, imageHeight, opacity = 0.4 }: HeatmapOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0 || imageWidth === 0 || imageHeight === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image exactly
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Clear canvas
    ctx.clearRect(0, 0, imageWidth, imageHeight);

    // Save context state
    ctx.save();

    // Create heatmap with enhanced visibility
    points.forEach(point => {
      // Create radial gradient for each point
      const radius = Math.max(30, 50 * point.intensity);
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      
      const color = point.color || '#ff6b6b';
      // Convert hex to RGB for better alpha control
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const maxAlpha = Math.min(point.intensity * 0.9, 0.8);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${maxAlpha})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${maxAlpha * 0.6})`);
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${maxAlpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      // Set blend mode for better visibility
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Apply overall opacity
    ctx.globalAlpha = opacity;
    ctx.restore();
  }, [points, imageWidth, imageHeight, opacity]);

  if (points.length === 0 || imageWidth === 0 || imageHeight === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-5"
      style={{ 
        mixBlendMode: 'screen',
        width: imageWidth,
        height: imageHeight,
        opacity: opacity
      }}
    />
  );
};

export default HeatmapOverlay;
