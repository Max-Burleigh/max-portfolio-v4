"use client";
import React from "react";
import Image from "next/image";
import { SiTailwindcss } from "react-icons/si";
import ProjectCard from "./shared/ProjectCard";

interface CarlyPhotographyProps {
  onMouseEnter: () => void;
  onClick: () => void;
}

const CarlyPhotography: React.FC<CarlyPhotographyProps> = ({
  onMouseEnter,
  onClick,
}) => {
  const iconStyle = { width: "32px", height: "32px" };

  return (
    <ProjectCard
      title="Carly Pearl-Sacks Photography"
      description="Portfolio site for a professional photographer. Built with Next.js and TailwindCSS."
      websiteUrl="https://carlypsphoto.com"
      className="carlypsphoto-card"
      reverseLayout={true}
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
            <SiTailwindcss
              className="tech-icon tailwind"
              style={iconStyle}
              color="#fff"
            />
          ),
          label: "TailwindCSS",
        },
      ]}
      imageUrl="/project-images/carly-phone-mockup-corner-to-corner.png"
      imageAlt="Screenshot of Carly Pearl-Sacks Photography website"
      imageTitle="Carly Pearl-Sacks Photography Website Screenshot"
      imageBlurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
      disablePhoneMockup={true}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="iframe-message carly-message">
        <div className="message-content">
          <div className="message-icon">📸</div>
          <p>
            <a
              href="https://carlypsphoto.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click to visit the website for the full experience
            </a>
          </p>
        </div>
      </div>
    </ProjectCard>
  );
};

export default CarlyPhotography;