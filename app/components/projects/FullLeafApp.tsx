"use client";
import React from "react";
import ProjectCard from "./ProjectCard";

const FullLeafApp: React.FC = () => {
  return (
    <ProjectCard
      title="Full Leaf App"
      description="A Flutter-based, WebView app for Full Leaf Tea Company."
      className="full-leaf-app-card"
    />
  );
};

export default FullLeafApp;
