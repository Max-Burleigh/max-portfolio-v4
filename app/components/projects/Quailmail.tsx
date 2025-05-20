"use client";
import React from "react";
import ProjectCard from "./shared/ProjectCard";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiVercel,
} from "react-icons/si";

const Quailmail: React.FC = () => {
  const iconStyle = { width: "32px", height: "32px" };
  const quailmailTechStack = [
    {
      icon: <SiNextdotjs className="tech-icon nextjs" style={iconStyle} />,
      label: "NextJS",
    },
    {
      icon: (
        <SiTailwindcss className="tech-icon tailwindcss" style={iconStyle} />
      ),
      label: "TailwindCSS",
    },
    {
      icon: <SiSupabase className="tech-icon supabase" style={iconStyle} />,
      label: "Supabase",
    },
    {
      icon: <SiVercel className="tech-icon vercel" style={iconStyle} />,
      label: "Vercel",
    },
  ];
  return (
    <ProjectCard
      title="Quailmail"
      description={
        <>
          An autonomous AI email agent.
          <br />
          <span className="italic text-sm text-[#00ffd5]">
            (Under construction, preview link coming soon)
          </span>
        </>
      }
      className="quailmail-card text-center md:text-left"
      imageUrl="/webp/quailmail.webp" // Image from public folder
      imageAlt="Quailmail application screenshot"
      imageBlurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAzMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
      techStack={quailmailTechStack}
      reverseLayout={true} // True for image on left, text on right
      disablePhoneMockup={true}
    />
  );
};

export default Quailmail;
