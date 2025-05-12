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
      description="An autonomous AI email agent."
      className="quailmail-card"
      imageUrl="/quailmail.png" // Image from public folder
      imageAlt="Quailmail application screenshot"
      techStack={quailmailTechStack}
      reverseLayout={true} // True for image on left, text on right
      disablePhoneMockup={true}
    />
  );
};

export default Quailmail;
