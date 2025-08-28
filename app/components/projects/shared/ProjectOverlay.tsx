"use client";
import React from "react";

interface ProjectOverlayProps {
  href: string;
  emoji?: React.ReactNode;
  className?: string; // e.g., "vinscribe-message", "fullleaf-message"
  childrenText?: string;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({
  href,
  emoji = "✨",
  className = "",
  childrenText = "Click to visit the website for the full experience",
}) => (
  <div className={`visit-site-message ${className}`.trim()}>
    <div className="message-content">
      <div className="message-icon">{emoji}</div>
      <p>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {childrenText}
        </a>
      </p>
    </div>
  </div>
);

export default ProjectOverlay;
