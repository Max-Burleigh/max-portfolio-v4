"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhoneMockup, PhoneContent } from "@components/phone";
import { TechStack } from "@components/ui";
import { ProjectCardProps } from "./types";

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  websiteUrl,
  techStack,
  previewUrl,
  // previewTitle,
  // previewClassName,
  imageUrl,
  imageAlt,
  imageTitle,
  imageBlurDataURL,
  reverseLayout = false,
  disablePhoneMockup = false,
  className = "",
  style,
  children,
  onMouseEnter,
  onClick,
  imageClassName,
}) => {
  // Determine if this is a fullleaf app card for variant purposes
  const isFullLeafApp = className?.includes("full-leaf-app-card");
  const isFullLeafTea = className?.includes("fullleaf-card");
  const isFullLeafWholesale = className?.includes("fullleaf-wholesale-card");

  return (
    <div
      className={`project-card ${reverseLayout ? "media-left" : "media-right"} ${className}`.trim()}
      style={{
        flexDirection: reverseLayout ? "row-reverse" : "row",
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
      {(imageUrl || (previewUrl && !disablePhoneMockup)) &&
        (disablePhoneMockup ? (
          <div
            className="project-media"
            style={{ position: "relative", cursor: onClick || onMouseEnter ? "pointer" : undefined }}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
          >
            {imageUrl && (
              <motion.div
                className="project-image-container"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt || `Screenshot of ${title}`}
                  title={imageTitle}
                  width={600}
                  height={1200}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={imageBlurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg=="}
                  className={`${title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-screenshot ${imageClassName || ""}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                  }}
                />
              </motion.div>
            )}
            {children}
          </div>
        ) : (
          <div className="project-media">
            <PhoneMockup
              variant={
                isFullLeafApp 
                  ? "fullleaf" 
                  : isFullLeafTea 
                  ? "fullleaf-tea" 
                  : isFullLeafWholesale 
                  ? "fullleaf-wholesale" 
                  : "default"
              }
              className={onClick || onMouseEnter ? "clickable" : ""}
              onMouseEnter={onMouseEnter}
              onClick={onClick}
            >
              {imageUrl && (
                <PhoneContent
                  type="image"
                  src={imageUrl}
                  variant={
                    isFullLeafApp
                      ? "fullleaf"
                      : isFullLeafTea
                      ? "fullleaf-tea"
                      : isFullLeafWholesale
                      ? "fullleaf-wholesale"
                      : undefined
                  }
                  alt={imageAlt || `Screenshot of ${title}`}
                  className={
                    imageClassName || title.toLowerCase().replace(/\s+/g, "-")
                  }
                  blurDataURL={imageBlurDataURL}
                />
              )}
              {children}
            </PhoneMockup>
          </div>
        ))}
    </div>
  );
};

export default React.memo(ProjectCard);
