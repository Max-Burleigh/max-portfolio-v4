"use client";
import React from "react";
import Image from "next/image";
import { SiTailwindcss } from "react-icons/si";
import ProjectCard from "./shared/ProjectCard";

const CarlyPhotography: React.FC = () => {
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
      iframeUrl="https://carlypsphoto.com"
      iframeTitle="Carly Pearl-Sacks Photography Mobile Preview"
      iframeClassName="carlypsphoto-iframe"
    />
  );
};

export default CarlyPhotography;
