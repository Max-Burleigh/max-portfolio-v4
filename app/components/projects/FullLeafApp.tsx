"use client";
import React from "react";
import ProjectCard from "./shared/ProjectCard";
import { SiFlutter } from "react-icons/si";

const FullLeafApp: React.FC = () => {
  return (
    <ProjectCard
      title="Full Leaf App"
      description="A Flutter-based, WebView app for Full Leaf Tea Company."
      techStack={[
        {
          icon: (
            <SiFlutter
              className="tech-icon flutter"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "Flutter",
        },
        { icon: null, label: "Xcode" },
        { icon: null, label: "Android Studio" },
      ]}
      imageUrl="/app.jpeg"
      imageAlt="Portrait screenshot of Full Leaf App"
      imageTitle="Full Leaf App Screenshot"
      className="full-leaf-app-card"
      disablePhoneMockup={true}
    />
  );
};

export default FullLeafApp;
