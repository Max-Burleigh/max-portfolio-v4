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
  // Config for Blob 1 (Teal/Dark Blue)
  {
    color: '0,255,213', // Primary color from .blob1 CSS (#00ffd5)
    softness: 0.75, // Corresponds to filter: blur(80px) and gradient end
    speed: 1 / 14, // To approximate a 14s animation cycle
    // Initial position from CSS (10vw left, top: -500px then translated -50%, -50%)
    // Framer initial: x: -50, y: -50. We'll aim for a similar visual start.
    // These are % of viewport width/height for center.
    initialOffsetX: 0.10, // Roughly 10vw for x, adjusted for centering logic
    initialOffsetY: 0.15, // Start somewhat visible, top: -500px is too high for canvas initial render
    // Amplitude from Framer: x animates +/-25 from center, y animates +/-50 from center
    amplitudeX: 0.05, // Approx 50px / viewport width (e.g. 1000px) = 0.05
    amplitudeY: 0.08, // Approx 100px / viewport height (e.g. 1000px) = 0.1, adjusted for feel
    frequencyX: 0.5, // Lower frequency for wider, slower horizontal sweep
    frequencyY: 0.7, // Slightly higher for y movement
    // .blob1 CSS size: 900x900px. General .aurora-blob size: 700x550.
    // radiusFactor is a multiplier of Math.max(w,h). A large blob.
    radiusFactor: 0.6, // Adjusted to be large, approximating 900px on a large screen
  },
  // Config for Blob 2 (Pink/Dark Purple)
  {
    color: '255,92,230', // Primary color from .blob2 CSS (#ff5ce6)
    softness: 0.75,
    speed: 1 / 18, // To approximate an 18s animation cycle
    // Initial position from CSS (right: 10vw, top: -500px then translated 50%, -50%)
    // Framer initial: x: 150, y: 50.
    initialOffsetX: 0.90, // Roughly 90vw for x (100vw - 10vw)
    initialOffsetY: 0.25, // Start somewhat visible
    // Amplitude from Framer: x animates +/-25, y animates +/-50
    amplitudeX: 0.04, // Approx 50px / viewport width
    amplitudeY: 0.07, // Approx 100px / viewport height
    frequencyX: 0.45, 
    frequencyY: 0.6,
    // .blob2 CSS size: 800x800px.
    radiusFactor: 0.55, // Slightly smaller than blob1
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
        // Base opacity from .aurora-blob CSS is 0.5. Framer animates opacity.
        // For canvas, we'll set a base opacity in the gradient that works with 'lighter' composite op.
        grad.addColorStop(0, `rgba(${blob.color},0.3)`); // Slightly reduced for 'lighter' blending
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
