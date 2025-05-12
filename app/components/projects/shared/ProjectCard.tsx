"use client";
import React from "react";
import Image from "next/image";
import {
  PhoneMockup,
  PhoneContent,
  InteractiveIframe,
  TechStack,
} from "../../index";
import { ProjectCardProps } from "./types";

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  websiteUrl,
  techStack,
  iframeUrl,
  iframeTitle,
  iframeClassName,
  imageUrl,
  imageAlt,
  imageTitle,
  reverseLayout = false,
  disablePhoneMockup = false,
  className = "",
  style,
  children,
  onMouseEnter,
  onClick,
}) => {
  // Determine if this is a fullleaf app card for variant purposes
  const isFullLeafApp = className?.includes("full-leaf-app-card");

  return (
    <div
      className={`project-card ${className}`}
      style={{
        display: "flex",
        flexDirection: reverseLayout ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        flexBasis: "100%",
        maxWidth: "100%",
        padding: "1.5rem",
        minHeight: "400px",
        ...style,
      }}
    >
      <div className="project-info">
        {websiteUrl ? (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <strong>{title}</strong>
          </a>
        ) : (
          <strong>{title}</strong>
        )}
        {typeof description === "string" ? <p>{description}</p> : description}
        {techStack && techStack.length > 0 && (
          <TechStack items={techStack} style={{ flexDirection: "row" }} />
        )}
      </div>
      {(iframeUrl || imageUrl) &&
        (disablePhoneMockup ? (
          <div
            style={
              onClick || onMouseEnter
                ? { position: "relative", cursor: "pointer" }
                : undefined
            }
            onMouseEnter={onMouseEnter}
            onClick={onClick}
          >
            {iframeUrl && (
              <InteractiveIframe
                src={iframeUrl}
                title={iframeTitle || `${title} Mobile Preview`}
                className={iframeClassName || ""}
              />
            )}
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={imageAlt || `Screenshot of ${title}`}
                title={imageTitle}
                width={300}
                height={600}
                className={`${title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-screenshot`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "1.5rem",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                }}
              />
            )}
            {children}
          </div>
        ) : (
          <PhoneMockup
            variant={isFullLeafApp ? "fullleaf" : "default"}
            className={onClick || onMouseEnter ? "clickable" : ""}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
          >
            {iframeUrl && (
              <PhoneContent
                type="iframe"
                src={iframeUrl}
                variant={
                  title.toLowerCase().includes("carlyps")
                    ? "carlypsphoto"
                    : "vinscribe"
                }
                alt={iframeTitle || `${title} Mobile Preview`}
                className={iframeClassName || ""}
              />
            )}
            {imageUrl && (
              <PhoneContent
                type="image"
                src={imageUrl}
                variant={isFullLeafApp ? "fullleaf" : undefined}
                alt={imageAlt || `Screenshot of ${title}`}
                className={title.toLowerCase().replace(/\s+/g, "-")}
              />
            )}
            {children}
          </PhoneMockup>
        ))}
    </div>
  );
};

export default ProjectCard;
