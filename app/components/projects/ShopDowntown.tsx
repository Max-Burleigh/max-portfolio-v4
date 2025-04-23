"use client";
import React from "react";
import { SiHtml5, SiCss3, SiJavascript, SiPhp, SiMysql } from "react-icons/si";
import ProjectCard from "./ProjectCard";

const ShopDowntown: React.FC = () => {
  return (
    <ProjectCard
      title="Shop Downtown"
      description="Community-driven online marketplace for local businesses."
      websiteUrl="https://shopdowntown.org/"
      className="shopdowntown-card vinscribe-card"
      reverseLayout={false}
      techStack={[
        { icon: <SiHtml5 className="tech-icon html5" style={{ width: "32px", height: "32px" }} />, label: "HTML" },
        { icon: <SiCss3 className="tech-icon css3" style={{ width: "32px", height: "32px" }} color="#fff" />, label: "CSS" },
        { icon: <SiJavascript className="tech-icon javascript" style={{ width: "32px", height: "32px" }} color="#fff" />, label: "JavaScript" },
        { icon: <SiPhp className="tech-icon php" style={{ width: "32px", height: "32px" }} color="#fff" />, label: "PHP" },
        { icon: <SiMysql className="tech-icon mysql" style={{ width: "32px", height: "32px" }} color="#fff" />, label: "MySQL" },
      ]}
      iframeUrl="https://shopdowntown.org/"
      iframeTitle="Shop Downtown Mobile Preview"
      iframeClassName="shopdowntown-iframe vinscribe-iframe"
    />
  );
};

export default ShopDowntown;
