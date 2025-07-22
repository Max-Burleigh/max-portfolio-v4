"use client";
import React from "react";
import ProjectCard from "./shared/ProjectCard";
import { SiFlutter, SiXcode, SiAndroidstudio } from "react-icons/si";

const FullLeafApp: React.FC = () => {
  const appStoreUrl =
    "https://apps.apple.com/us/app/full-leaf-tea-co/id6451437741";
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=fullleafteacompany.android.app&hl=en_US&pli=1";

  // Store link styles for consistent appearance on mobile and desktop
  const storeLinkStyle = {
    textShadow:
      "0 0 5px #fff, " +
      "0 0 10px #67e8f9, " +
      "0 0 15px #22d3ee, " +
      "0 0 20px #22d3ee, " +
      "0 0 25px #06b6d4, " +
      "0 0 30px #06b6d4",
  };

  // Unified banner for all devices (mobile-first, but visible on desktop too)
  const storeBanner = (
    <div className="flex justify-center md:justify-start items-center my-4 px-2">
      <div
        className="flex flex-row justify-center md:justify-start items-center text-base font-bold uppercase tracking-wider"
        style={{
          fontFamily:
            "'Brush Script MT', 'Brush Script Std', 'Lucida Calligraphy', 'Lucida Handwriting', cursive",
        }}
      >
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
          style={storeLinkStyle}
        >
          App&nbsp;Store
        </a>
        <span
          className="mx-2 text-xl md:text-2xl text-neutral-400 select-none"
          style={{
            fontFamily:
              "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif",
            fontWeight: 700,
            lineHeight: 1,
            display: "inline-block",
            verticalAlign: "middle",
            letterSpacing: "0",
          }}
          aria-hidden="true"
        >
          ·
        </span>
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
          style={storeLinkStyle}
        >
          Play&nbsp;Store
        </a>
      </div>
    </div>
  );

  return (
    <ProjectCard
      title="Full Leaf App"
      description={
        <>
          A Flutter-based, WebView app for Full Leaf Tea Company.
          {storeBanner}
        </>
      }
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
        {
          icon: (
            <SiXcode
              className="tech-icon xcode"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "Xcode",
        },
        {
          icon: (
            <SiAndroidstudio
              className="tech-icon android-studio"
              style={{ width: "32px", height: "32px" }}
            />
          ),
          label: "Android Studio",
        },
      ]}
      imageUrl="/webp/app.webp"
      imageAlt="Portrait screenshot of Full Leaf App"
      imageTitle="Full Leaf App Screenshot"

      className="full-leaf-app-card flex flex-col items-center"
      disablePhoneMockup={true}
    />
  );
};

export default FullLeafApp;
