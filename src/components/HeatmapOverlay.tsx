
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

    // Set canvas size to match image
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Clear canvas
    ctx.clearRect(0, 0, imageWidth, imageHeight);

    // Create heatmap with proper blending
    ctx.globalCompositeOperation = 'screen';
    
    points.forEach(point => {
      // Create radial gradient for each point
      const radius = 40 * point.intensity;
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      
      const color = point.color || '#ff6b6b';
      // Convert hex to RGB for better alpha control
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const maxAlpha = Math.min(point.intensity * 0.8, 0.6);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${maxAlpha})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${maxAlpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Apply overall opacity
    ctx.globalAlpha = opacity;
  }, [points, imageWidth, imageHeight, opacity]);

  if (points.length === 0 || imageWidth === 0 || imageHeight === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ 
        mixBlendMode: 'multiply',
        width: imageWidth,
        height: imageHeight
      }}
    />
  );
};

export default HeatmapOverlay;
