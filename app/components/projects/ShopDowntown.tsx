"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiHtml5, SiCss3, SiJavascript, SiPhp, SiMysql } from "react-icons/si";
import ProjectCard from "./shared/ProjectCard";

interface ShopDowntownProps {
  shopDowntownMessageState: "hidden" | "first" | "second";
  onMouseEnter: () => void;
  onClick: () => void;
}

const ShopDowntown: React.FC<ShopDowntownProps> = ({
  shopDowntownMessageState,
  onMouseEnter,
  onClick,
}) => {
  return (
    <ProjectCard
      title="Shop Downtown"
      description="Community-driven online marketplace for local businesses."
      websiteUrl="https://shopdowntown.org/"
      className="shopdowntown-card"
      reverseLayout={false}
      techStack={[
        {
          icon: (
            <SiHtml5
              className="tech-icon html5"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "HTML",
        },
        {
          icon: (
            <SiCss3
              className="tech-icon css3"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "CSS",
        },
        {
          icon: (
            <SiJavascript
              className="tech-icon javascript"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "JavaScript",
        },
        {
          icon: (
            <SiPhp
              className="tech-icon php"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "PHP",
        },
        {
          icon: (
            <SiMysql
              className="tech-icon mysql"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "MySQL",
        },
      ]}
      imageUrl="/project-images/shop-downtown-mockup-corner-to-corner.png"
      imageAlt="Screenshot of Shop Downtown website"
      imageTitle="Shop Downtown Website Screenshot"
      imageBlurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkyIiBoZWlnaHQ9IjEyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMDEwMTAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
      disablePhoneMockup={true}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <AnimatePresence>
        {shopDowntownMessageState !== "hidden" && (
          <motion.div
            className="iframe-message shopdowntown-message"
            style={{
              pointerEvents:
                shopDowntownMessageState === "second" ? "auto" : "none",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-content">
              <div className="message-icon">🏪</div>
              <p>
                <a
                  href="https://shopdowntown.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click to visit the website for the full experience
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectCard>
  );
};

export default ShopDowntown;