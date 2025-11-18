"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Phone from "@components/Phone";
import TechStack from "@components/TechStack";

export interface ProjectCardProps {
  title: string;
  description: React.ReactNode;
  websiteUrl?: string;
  techStack?: { icon: React.ReactNode; label: string }[];
  previewUrl?: string;
  previewTitle?: string;
  previewClassName?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageClassName?: string;
  imageBlurDataURL?: string;
  reverseLayout?: boolean;
  disablePhoneMockup?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  overlay?: { href: string; emoji?: string; text?: string; className?: string };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  websiteUrl,
  techStack,
  previewUrl,
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
  overlay,
}) => {
  const isFullLeafApp = className?.includes("full-leaf-app-card");
  const isFullLeafTea = className?.includes("fullleaf-card");
  const isFullLeafWholesale = className?.includes("fullleaf-wholesale-card");

  const renderOverlay = () => {
    if (!overlay) return null;
    const { href, emoji = "✨", text = "Click to visit the website for the full experience", className } = overlay;
    return (
      <div className={`visit-site-message ${className || ""}`.trim()}>
        <div className="message-content">
          <div className="message-icon">{emoji}</div>
          <p>
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial="inactive"
              whileHover="active"
              whileFocus="active"
            >
              <span>{text}</span>
              <motion.span
                className="elastic-underline"
                variants={{
                  inactive: { scaleX: 0 },
                  active: {
                    scaleX: 1,
                    transition: { type: "spring", stiffness: 420, damping: 28, bounce: 0 },
                  },
                }}
              />
            </motion.a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`project-card ${reverseLayout ? "media-left md:flex-row-reverse" : "media-right md:flex-row"} ${className}`.trim()}
      style={style}
      data-entrance-item
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

      {(imageUrl || previewUrl) && (
        <div
          className="project-media"
          style={{ position: "relative", cursor: onClick || onMouseEnter ? "pointer" : undefined }}
          onMouseEnter={onMouseEnter}
          onClick={onClick}
        >
          {disablePhoneMockup ? (
            <>
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
                    className={`${title.toLowerCase().replace(/\s+/g, "-")}-screenshot ${imageClassName || ""}`}
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
              {renderOverlay()}
              {children}
            </>
          ) : (
            <>
              <Phone
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
                type={imageUrl ? "image" : previewUrl ? "preview" : "custom"}
                src={imageUrl || previewUrl}
                alt={imageAlt || `Screenshot of ${title}`}
                contentClassName={
                  imageClassName || title.toLowerCase().replace(/\s+/g, "-")
                }
                blurDataURL={imageBlurDataURL}
              >
                {children}
              </Phone>
              {renderOverlay()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ProjectCard);
