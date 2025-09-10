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
// Assuming an Anthropic icon might be a simple text or a generic AI icon if a specific one isn't readily available
// For now, we can use a placeholder or omit it if no suitable icon is found.
// import { AnthropicIcon } from "../icons"; // Example if you have a custom icon

const BasedChat: React.FC = () => {
  const iconStyle = { width: "32px", height: "32px" };
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);

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
      className="project-card based-chat-card"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        padding: "1.5rem",
        minHeight: "400px",
        width: "100%",
      }}
    >
      {/* Video on the left */}
      <div
        ref={videoWrapRef}
        style={{
          flex: "1",
          minWidth: "280px",
          maxWidth: "600px",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        {shouldLoadVideo ? (
          <video
            src="/based-chat-2.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/webp/api.webp"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <Image
            src="/webp/api.webp"
            alt="Based Chat preview"
            width={1200}
            height={675}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}
      </div>

      {/* Text content on the right */}
      <div style={{ flex: "1", minWidth: "280px" }} className="project-info">
        <strong>Based Chat</strong>
        <p>
          An LLM-agnostic chat application, with many cool features like drag
          and dropping entire folders, branched threads, prompt storage, code
          preview, and much more.
          <br />
          <span className="italic text-sm text-[#00ffd5]">
            (Preview link coming soon)
          </span>
        </p>
        <div
          className="tech-stack"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          <div className="tech-item">
            <SiNextdotjs className="tech-icon nextjs" style={iconStyle} />
            <span>Next.js</span>
          </div>
          <div className="tech-item">
            <SiSupabase className="tech-icon supabase" style={iconStyle} />
            <span>Supabase</span>
          </div>
          <div className="tech-item">
            <SiOpenai className="tech-icon openai" style={iconStyle} />
            <span>OpenAI</span>
          </div>
          <div className="tech-item">
            <div
              style={{
                width: "32px",
                height: "32px",
                position: "relative",
                marginRight: "8px",
              }}
            >
              <Image
                src="/Anthropic/Anthropic_Symbol_0.svg"
                alt="Anthropic"
                fill
                style={{ objectFit: "contain" }}
                className="tech-icon anthropic"
              />
            </div>
            <span>Anthropic</span>
          </div>
          <div className="tech-item">
            <SiGoogle className="tech-icon google-gemini" style={iconStyle} />
            <span>Google Gemini</span>
          </div>
          <div className="tech-item">
            <SiTailwindcss
              className="tech-icon tailwindcss"
              style={iconStyle}
            />
            <span>TailwindCSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasedChat;
