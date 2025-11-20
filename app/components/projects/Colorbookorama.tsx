"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  SiNextdotjs,
  SiFirebase,
  SiTypescript,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";
import { useIsMobile } from "@lib/hooks";

const Colorbookorama: React.FC = () => {
  const iconStyle = { width: "32px", height: "32px" };
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const element = videoWrapRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="project-card colorbookorama-card"
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        padding: "1.5rem",
        minHeight: "400px",
        width: "100%",
      }}
      data-entrance-item
    >
      <div style={{ flex: "1", minWidth: "280px" }} className="project-info">
        <strong>Colorbookorama</strong>
        <p>
          Full-stack AI coloring book generator where creators sign in, craft
          pages with GPT image and judge models, then bundle a polished,
          printable PDF in minutes.
        </p>
        <div
          className="tech-stack"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          <div className="tech-item">
            <SiNextdotjs className="tech-icon nextjs" style={iconStyle} color="#fff" />
            <span>Next.js</span>
          </div>
          <div className="tech-item">
            <SiVercel className="tech-icon vercel" style={iconStyle} color="#fff" />
            <span>Vercel</span>
          </div>
          <div className="tech-item">
            <SiFirebase className="tech-icon firebase" style={iconStyle} color="#fff" />
            <span>Firebase</span>
          </div>
          <div className="tech-item">
            <SiTypescript className="tech-icon typescript" style={iconStyle} color="#fff" />
            <span>TypeScript</span>
          </div>
          <div className="tech-item">
            <SiTailwindcss className="tech-icon tailwindcss" style={iconStyle} color="#fff" />
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>

      <div
        ref={videoWrapRef}
        style={{
          flex: "1",
          minWidth: "280px",
          maxWidth: "600px",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 55%), radial-gradient(circle at 80% 20%, rgba(0,255,213,0.15), transparent 60%), rgba(19,20,25,0.96)",
          aspectRatio: "16/9",
        }}
      >
        {shouldLoadVideo ? (
          <video
            src="/colorbookorama.mp4"
            controls={!isMobile}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <div
            role="img"
            aria-label="Colorbookorama walkthrough preview"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f4f8ff",
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
            }}
          >
            Colorbookorama Preview Loading…
          </div>
        )}
      </div>

    </div>
  );
};

export default Colorbookorama;
