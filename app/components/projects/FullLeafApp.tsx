"use client";
import React from "react";
import ProjectCard from "./shared/ProjectCard";
import { SiFlutter } from "react-icons/si";

const FullLeafApp: React.FC = () => {
  const appStoreUrl =
    "https://apps.apple.com/us/app/full-leaf-tea-co/id6451437741";
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=fullleafteacompany.android.app&hl=en_US&pli=1";

  const neonBanner = (
    <div className="flex justify-center items-center my-4 px-2">
      <div
        className="inline-block px-2 sm:px-4 py-2 rounded-lg border-4 border-pink-400 w-full max-w-xs sm:max-w-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          boxShadow:
            "0 0 5px #fff, " +
            "0 0 10px #f9a8d4, " +
            "0 0 18px #f472b6, " +
            "0 0 25px #db2777",
        }}
      >
        <div
          className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider text-pink-400 flex flex-col sm:flex-row justify-center items-center"
          style={{
            fontFamily:
              "'Brush Script MT', 'Brush Script Std', 'Lucida Calligraphy', 'Lucida Handwriting', cursive",
            textShadow:
              "0 0 5px #fff, " +
              "0 0 10px #fff, " +
              "0 0 15px #f9a8d4, " +
              "0 0 20px #f472b6, " +
              "0 0 25px #f472b6, " +
              "0 0 30px #db2777, " +
              "0 0 35px #db2777",
          }}
        >
          <span className="mx-1 mb-1 sm:mb-0">Live on the</span>
          <div className="flex flex-row flex-wrap justify-center">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
              style={{
                textShadow:
                  "0 0 5px #fff, " +
                  "0 0 10px #67e8f9, " +
                  "0 0 15px #22d3ee, " +
                  "0 0 20px #22d3ee, " +
                  "0 0 25px #06b6d4, " +
                  "0 0 30px #06b6d4",
              }}
            >
              App&nbsp;Store
            </a>
            <span className="mx-1">&amp;</span>
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1.5 text-cyan-400 hover:text-cyan-300 hover:brightness-150 transition-all duration-200 underline"
              style={{
                textShadow:
                  "0 0 5px #fff, " +
                  "0 0 10px #67e8f9, " +
                  "0 0 15px #22d3ee, " +
                  "0 0 20px #22d3ee, " +
                  "0 0 25px #06b6d4, " +
                  "0 0 30px #06b6d4",
              }}
            >
              Play&nbsp;Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProjectCard
      title="Full Leaf App"
      description={
        <>
          A Flutter-based, WebView app for Full Leaf Tea Company.
          {neonBanner}
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
        { icon: null, label: "Xcode" },
        { icon: null, label: "Android Studio" },
      ]}
      imageUrl="/app.jpeg"
      imageAlt="Portrait screenshot of Full Leaf App"
      imageTitle="Full Leaf App Screenshot"
      className="full-leaf-app-card flex flex-col items-center"
      disablePhoneMockup={true}
    />
  );
};

export default FullLeafApp;
