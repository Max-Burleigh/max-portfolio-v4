"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Keep behavior identical: render two animated blobs and the canvas fallback.
// CSS on <html> (.is-ios-device / .not-ios-device) controls visibility.

// Canvas drawing config (ported from previous CanvasAurora)
interface BlobConfig {
    color: string;
    softness: number;
    speed: number;
    initialOffsetX: number;
    initialOffsetY: number;
    amplitudeX: number;
    amplitudeY: number;
    frequencyX: number;
    frequencyY: number;
    radiusFactor: number;
  }

const defaultBlobs: BlobConfig[] = [
  {
    color: "0,255,213",
    softness: 0.75,
    speed: 1 / 14,
    initialOffsetX: 0.1,
    initialOffsetY: 0.15,
    amplitudeX: 0.05,
    amplitudeY: 0.08,
    frequencyX: 0.5,
    frequencyY: 0.7,
    radiusFactor: 0.6,
  },
  {
    color: "255,92,230",
    softness: 0.75,
    speed: 1 / 18,
    initialOffsetX: 0.9,
    initialOffsetY: 0.25,
    amplitudeX: 0.04,
    amplitudeY: 0.07,
    frequencyX: 0.45,
    frequencyY: 0.6,
    radiusFactor: 0.55,
  },
];

const AuroraBackground: React.FC = () => {
  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  } as const;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const isIOS = html.classList.contains("is-ios-device");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isIOS || prefersReducedMotion) return; // Only draw on iOS

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let frameId = 0;
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
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      defaultBlobs.forEach((blob) => {
        const timeFactor = t * blob.speed;
        const cx =
          w * blob.initialOffsetX +
          Math.sin(timeFactor * blob.frequencyX) * w * blob.amplitudeX;
        const cy =
          h * blob.initialOffsetY +
          Math.cos(timeFactor * blob.frequencyY) * h * blob.amplitudeY;
        const radius = Math.max(w, h) * blob.radiusFactor;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${blob.color},0.3)`);
        grad.addColorStop(blob.softness, `rgba(${blob.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Blobs (hidden on iOS via CSS) */}
      <motion.div
        className="blob1 aurora-blob"
        initial={{ opacity: 0.5, scale: 1, x: -50, y: -50 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
          x: [-50, 0, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />
      <motion.div
        className="blob2 aurora-blob"
        initial={{ opacity: 0.4, scale: 1, x: 150, y: 50 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.3, 1],
          x: [150, 200, 150],
          y: [50, 150, 50],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />

      {/* Canvas (hidden on non‑iOS via CSS) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none canvas-aurora"
        aria-hidden="true"
      />
    </>
  );
};

export default AuroraBackground;
