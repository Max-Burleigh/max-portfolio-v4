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
import TechStack from "@components/TechStack";

const Colorbookorama: React.FC = () => {
  const techItems = [
    { icon: <SiNextdotjs size={32} color="#fff" />, label: "Next.js" },
    { icon: <SiVercel size={32} color="#fff" />, label: "Vercel" },
    { icon: <SiFirebase size={32} color="#fff" />, label: "Firebase" },
    { icon: <SiTypescript size={32} color="#fff" />, label: "TypeScript" },
    { icon: <SiTailwindcss size={32} color="#fff" />, label: "Tailwind CSS" },
  ];
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
      className="flex w-full flex-col md:flex-row-reverse items-center justify-between gap-8 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 text-left transition-colors duration-300 hover:bg-[rgba(255,255,255,0.06)] min-h-[400px]"
      data-entrance-item
    >
      <div className="flex-1 w-full min-w-[280px] flex flex-col text-left">
        <strong className="mb-2 block text-[1.2rem] text-[#00ffd5]">Colorbookorama</strong>
        <p className="text-base leading-[1.4] text-white">
          Full-stack AI coloring book generator where creators sign in, craft pages with GPT image and judge models, then bundle a polished, printable PDF in minutes.
        </p>
        <div className="mt-4">
          <TechStack items={techItems} />
          <p className="mt-4 text-sm text-[rgba(255,255,255,0.6)] italic">
            Preview link coming soon
          </p>
        </div>
      </div>

      <div
        ref={videoWrapRef}
        className="relative flex-1 w-full min-w-[280px] max-w-[600px] overflow-hidden rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
        style={{
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label="Colorbookorama walkthrough preview"
            className="flex h-full w-full items-center justify-center text-[clamp(1rem,2.5vw,1.5rem)] font-semibold tracking-[0.05em] uppercase text-[#f4f8ff] backdrop-blur-[8px]"
          >
            Colorbookorama Preview Loading…
          </div>
        )}
      </div>

    </div>
  );
};

export default Colorbookorama;
