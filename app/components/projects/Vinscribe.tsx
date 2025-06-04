"use client";
import React from "react";
import Image from "next/image";
import { SiFirebase, SiTypescript, SiTailwindcss } from "react-icons/si";
import ProjectCard from "./shared/ProjectCard";

const Vinscribe: React.FC = () => {
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
      imageUrl="/webp/vinscribe.webp"
      imageAlt="Screenshot of VINSCRIBE website"
      imageTitle="VINSCRIBE Website Screenshot"
      disablePhoneMockup={true}
    />
  );
};

export default Vinscribe;
