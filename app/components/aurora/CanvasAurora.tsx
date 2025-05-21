"use client";
import React, { useRef, useEffect } from 'react';

interface BlobConfig {
  color: string; // RGB string e.g., "0,255,213"
  softness: number; // 0 to 1
  speed: number;
  initialOffsetX: number; // 0 to 1 (percentage of width)
  initialOffsetY: number; // 0 to 1 (percentage of height)
  amplitudeX: number; // 0 to 1 (percentage of width)
  amplitudeY: number; // 0 to 1 (percentage of height)
  frequencyX: number;
  frequencyY: number;
  radiusFactor: number; // Multiplier for max(width, height)
}

const defaultBlobs: BlobConfig[] = [
  {
    color: '0,200,255', // Lighter Teal/Blue
    softness: 0.6,
    speed: 0.8,
    initialOffsetX: 0.2,
    initialOffsetY: 0.2,
    amplitudeX: 0.1,
    amplitudeY: 0.1,
    frequencyX: 0.7,
    frequencyY: 0.9,
    radiusFactor: 0.45,
  },
  {
    color: '120,50,220', // Deep Purple
    softness: 0.7,
    speed: 0.6,
    initialOffsetX: 0.5,
    initialOffsetY: 0.5,
    amplitudeX: 0.15,
    amplitudeY: 0.15,
    frequencyX: 0.5,
    frequencyY: 0.6,
    radiusFactor: 0.55,
  },
  {
    color: '255,100,200', // Bright Pink
    softness: 0.65,
    speed: 0.7,
    initialOffsetX: 0.8,
    initialOffsetY: 0.8,
    amplitudeX: 0.12,
    amplitudeY: 0.12,
    frequencyX: 0.8,
    frequencyY: 0.75,
    radiusFactor: 0.5,
  },
];

interface CanvasAuroraProps {
  blobs?: BlobConfig[];
  className?: string;
}

const CanvasAurora: React.FC<CanvasAuroraProps> = ({ 
  blobs = defaultBlobs, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let frameId: number;
    let t = 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.016; // Base time increment
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter'; // 'lighter' can be more performant than 'lighten'

      blobs.forEach(blob => {
        const timeFactor = t * blob.speed;
        const cx = w * blob.initialOffsetX + Math.sin(timeFactor * blob.frequencyX) * w * blob.amplitudeX;
        const cy = h * blob.initialOffsetY + Math.cos(timeFactor * blob.frequencyY) * h * blob.amplitudeY;
        const radius = Math.max(w, h) * blob.radiusFactor;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${blob.color},0.5)`); // Adjust opacity as needed
        grad.addColorStop(blob.softness, `rgba(${blob.color},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [blobs]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

CanvasAurora.displayName = 'CanvasAurora';

export default CanvasAurora;
