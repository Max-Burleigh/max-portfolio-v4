"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  SiNextdotjs,
  SiSupabase,
  SiTailwindcss,
  SiOpenai,
  SiGoogle,
} from "react-icons/si";
import { useIsMobile } from "@lib/hooks";
import TechStack from "@components/TechStack";

const BasedChat: React.FC = () => {
  const techItems = [
    { icon: <SiNextdotjs size={32} />, label: "Next.js" },
    { icon: <SiSupabase size={32} />, label: "Supabase" },
    { icon: <SiOpenai size={32} />, label: "OpenAI" },
    {
      icon: (
        <Image
          src="/Anthropic/Anthropic_Symbol_0.svg"
          alt="Anthropic"
          width={32}
          height={32}
          style={{ objectFit: "contain" }}
        />
      ),
      label: "Anthropic",
    },
    { icon: <SiGoogle size={32} />, label: "Google Gemini" },
    { icon: <SiTailwindcss size={32} />, label: "TailwindCSS" },
  ];
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = videoWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="flex w-full flex-col md:flex-row-reverse items-center justify-between gap-8 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 text-left transition-colors duration-300 hover:bg-[rgba(255,255,255,0.06)] min-h-[400px]"
      data-entrance-item
    >
      {/* Video on the left */}
      <div
        ref={videoWrapRef}
        className="relative flex-1 w-full min-w-[280px] max-w-[600px] overflow-hidden rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
        style={{ aspectRatio: "16/9" }}
      >
        {shouldLoadVideo ? (
          <video
            src="/based-chat-2.mp4"
            controls={!isMobile}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/webp/api.webp"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/webp/api.webp"
            alt="Based Chat preview"
            width={1200}
            height={675}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text content on the right */}
      <div className="flex-1 w-full min-w-[280px] flex flex-col text-left">
        <strong className="mb-2 block text-[1.2rem] text-[#00ffd5]">Based Chat</strong>
        <p className="text-base leading-[1.4] text-white">
          An LLM-agnostic chat application, with many cool features like drag and dropping entire folders, branched threads, prompt storage, code preview, and much more.
          <br />
          <span className="italic text-sm text-[#00ffd5]">(Preview link coming soon)</span>
        </p>
        <div className="mt-4">
          <TechStack items={techItems} />
        </div>
      </div>
    </div>
  );
};

export default BasedChat;
