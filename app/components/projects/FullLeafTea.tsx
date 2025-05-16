"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SiHtml5, SiCss3, SiJavascript, SiGoogle } from "react-icons/si";
import { ModernWindowsIcon } from "../index";
import ProjectCard from "./shared/ProjectCard";

interface FullLeafTeaProps {
  fullLeafMessageState: "hidden" | "first" | "second";
  onMouseEnter: () => void;
  onClick: () => void;
}

const FullLeafTea: React.FC<FullLeafTeaProps> = ({
  fullLeafMessageState,
  onMouseEnter,
  onClick,
}) => {
  return (
    <ProjectCard
      title="Full Leaf Tea Company"
      description={
        <>
          <p>
            Multi-million dollar ecommerce business for premium loose leaf tea.
          </p>
          <br />
          <p>Designed/developed by yours truly.</p>
        </>
      }
      websiteUrl="https://fullleafteacompany.com"
      className="fullleaf-card full-leaf-tea-card"
      reverseLayout={true}
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
            <Image
              src="/klaviyo.png"
              alt="Klaviyo"
              width={38}
              height={38}
              className="tech-icon klaviyo"
            />
          ),
          label: "Klaviyo",
        },
        {
          icon: (
            <SiGoogle
              className="tech-icon google"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "Google Ads",
        },
        {
          icon: (
            <ModernWindowsIcon
              className="tech-icon windows"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "Microsoft Ads",
        },
      ]}
      imageUrl="/full-leaf.jpg"
      imageAlt="Screenshot of Full Leaf Tea Company website"
      imageTitle="Full Leaf Tea Company Website Screenshot"
      imageClassName="fullleaf-tea"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <AnimatePresence>
        {fullLeafMessageState !== "hidden" && (
          <motion.div
            className="iframe-message fullleaf-message"
            style={{
              pointerEvents:
                fullLeafMessageState === "second" ? "auto" : "none",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-content">
              <div className="message-icon">🫖</div>
              <p>Try tapping harder.</p>
              <AnimatePresence>
                {fullLeafMessageState === "second" && (
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
                      href="https://fullleafteacompany.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click to visit the website
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

export default FullLeafTea;
