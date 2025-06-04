"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SiFirebase, SiTypescript, SiTailwindcss } from "react-icons/si";
import ProjectCard from "./shared/ProjectCard";

interface VinscribeProps {
  vinscribeMessageState: "hidden" | "first" | "second";
  onMouseEnter: () => void;
  onClick: () => void;
}

const Vinscribe: React.FC<VinscribeProps> = ({
  vinscribeMessageState,
  onMouseEnter,
  onClick,
}) => {
  return (
    <ProjectCard
      title="VINSCRIBE"
      description="AI-driven vehicle history reports and automotive tools."
      websiteUrl="https://www.vinscribe.com"
      className="vinscribe-card"
      techStack={[
        {
          icon: (
            <Image
              src="/next.svg"
              alt="Next.js"
              width={32}
              height={32}
              className="tech-icon nextjs"
            />
          ),
          label: "Next.js",
        },
        {
          icon: (
            <SiFirebase
              className="tech-icon firebase"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "Firebase",
        },
        {
          icon: (
            <SiTypescript
              className="tech-icon typescript"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "TypeScript",
        },
        {
          icon: (
            <SiTailwindcss
              className="tech-icon tailwind"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "TailwindCSS",
        },
      ]}
      imageUrl="/project-images/vinscribe-phone-mockup-corner-to-corner.png"
      imageAlt="Screenshot of VINSCRIBE website"
      imageTitle="VINSCRIBE Website Screenshot"
      imageBlurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
      disablePhoneMockup={true}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <AnimatePresence>
        {vinscribeMessageState !== "hidden" && (
          <motion.div
            className="iframe-message vinscribe-message"
            style={{
              pointerEvents:
                vinscribeMessageState === "second" ? "auto" : "none",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-content">
              <div className="message-icon">🚗</div>
              <p>
                <a
                  href="https://www.vinscribe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click to visit the website for the full experience
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectCard>
  );
};

export default Vinscribe;