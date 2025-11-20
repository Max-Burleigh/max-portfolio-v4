"use client";
import React, { useEffect, useRef } from "react";

// Keep behavior identical: render fixed gradient, a single blurred layer wrapping two animated blobs, and a canvas safety fallback.

// Canvas drawing config and bitmaps are built per-size; no static blob configs needed.

const AuroraBackground: React.FC = () => {
  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  } as const;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const isIOS = html.classList.contains("is-ios-device");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isIOS || prefersReduced) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let t = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = window.innerWidth;
      // Use outerHeight on iOS to ensure full coverage behind bars
      const h = isIOS ? window.outerHeight : window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const makeBlobBitmap = async (
      radiusPx: number,
      rgb: string,
      softnessStop = 0.75,
      innerAlpha = 0.45
    ) => {
      const off = document.createElement("canvas");
      off.width = off.height = Math.max(2, Math.floor(radiusPx * 2));
      const octx = off.getContext("2d")!;
      const r = radiusPx;
      const g = octx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, `rgba(${rgb},${innerAlpha})`);
      g.addColorStop(softnessStop, `rgba(${rgb},0)`);
      octx.fillStyle = g;
      octx.fillRect(0, 0, off.width, off.height);
      // Prefer ImageBitmap when available; otherwise use the canvas itself.
      const anyWin = window as unknown as { createImageBitmap?: (source: CanvasImageSource) => Promise<ImageBitmap> };
      if (typeof anyWin.createImageBitmap === "function") {
        return await anyWin.createImageBitmap(off);
      }
      return off;
    };

    let blob1: CanvasImageSource | null = null;
    let blob2: CanvasImageSource | null = null;

    const drawFrame = () => {
      t += 0.016;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      const R = Math.max(w, h) * 0.6;
      const R2 = R * 0.92;

      const cx1 = w * 0.1 + Math.sin(t * 0.5) * w * 0.05;
      const cy1 = -h * 0.5 + Math.cos(t * 0.7) * h * 0.08;
      const cx2 = w * 0.9 + Math.sin(t * 0.45) * w * 0.04;
      const cy2 = -h * 0.5 + Math.cos(t * 0.6) * h * 0.07;

      if (blob1) ctx.drawImage(blob1, cx1 - R, cy1 - R, R * 2, R * 2);
      if (blob2) ctx.drawImage(blob2, cx2 - R2, cy2 - R2, R2 * 2, R2 * 2);

      raf = requestAnimationFrame(drawFrame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(drawFrame);
    };

    const build = async () => {
      const R = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      [blob1, blob2] = await Promise.all([
        makeBlobBitmap(R, "0,255,213", 0.75, 0.45),
        makeBlobBitmap(R * 0.92, "255,92,230", 0.75, 0.4),
      ]);
      start();
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") cancelAnimationFrame(raf);
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    const boot = () => {
      cancelAnimationFrame(raf);
      build();
    };

    if (html.getAttribute("data-intro-played") === "1") {
      boot();
    } else {
      const mo = new MutationObserver(() => {
        if (html.getAttribute("data-intro-played") === "1") {
          mo.disconnect();
          boot();
        }
      });
      mo.observe(html, { attributes: true, attributeFilter: ["data-intro-played"] });
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      blob1 = null;
      blob2 = null;
    };
  }, []);

  return (
    <>
      {/* Root gradient background */}
      <div className="aurora-bg" aria-hidden="true" />
      {/* Single blur wrapper containing all blobs */}
      <div className="aurora-layer" aria-hidden="true">
        <div className="blob1 aurora-blob" {...blobProps} />
        <div className="blob2 aurora-blob" {...blobProps} />
      </div>

      {/* Canvas stays hidden by CSS unless explicitly enabled */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none canvas-aurora"
        aria-hidden="true"
      />
    </>
  );
};

export default AuroraBackground;
