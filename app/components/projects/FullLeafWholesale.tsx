"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SiHtml5, SiCss3, SiJavascript, SiShopify } from "react-icons/si";

import ProjectCard from "./shared/ProjectCard";

interface FullLeafWholesaleProps {
  fullLeafWholesaleMessageState: "hidden" | "first" | "second";
  onMouseEnter: () => void;
  onClick: () => void;
}

const FullLeafWholesale: React.FC<FullLeafWholesaleProps> = ({
  fullLeafWholesaleMessageState,
  onMouseEnter,
  onClick,
}) => {
  return (
    <ProjectCard
      title="Full Leaf Tea Company Wholesale"
      description={
        <>
          <p>
            B2B wholesale platform for bulk tea orders and business
            partnerships.
          </p>
          <p>
            Enabling cafes, restaurants, and retailers to source premium tea.
          </p>
        </>
      }
      websiteUrl="https://wholesale.fullleafteacompany.com"
      className="fullleaf-wholesale-card full-leaf-wholesale-card"
      reverseLayout={false}
      techStack={[
        {
          icon: (
            <SiShopify
              className="tech-icon shopify"
              style={{ width: "32px", height: "32px" }}
              color="#fff"
            />
          ),
          label: "Shopify",
        },
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
            <Image
              src="/webp/klaviyo.webp"
              alt="Klaviyo"
              width={38}
              height={38}
              className="tech-icon klaviyo"
            />
          ),
          label: "Klaviyo",
        },
      ]}
      imageUrl="/webp/fullleafwholesale.webp"
      imageAlt="Screenshot of Full Leaf Tea Company Wholesale website"
      imageTitle="Full Leaf Tea Company Wholesale Website Screenshot"
      imageClassName="fullleaf-wholesale"
      imageBlurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzMzNWUzYiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjJmMjAiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
      disablePhoneMockup={true}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <AnimatePresence>
        {fullLeafWholesaleMessageState !== "hidden" && (
          <motion.div
            className="iframe-message fullleaf-wholesale-message"
            style={{
              pointerEvents:
                fullLeafWholesaleMessageState === "second" ? "auto" : "none",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-content">
              <div className="message-icon">📦</div>
              <p>Try ordering in bulk.</p>
              <AnimatePresence>
                {fullLeafWholesaleMessageState === "second" && (
                  <motion.p
                    key="second-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: 8 }}
                  >
                    Just kidding, it's just a picture.
                    <br />
                    <a
                      href="https://wholesale.fullleafteacompany.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click to visit the wholesale site
                    </a>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectCard>
  );
};

export default FullLeafWholesale;
