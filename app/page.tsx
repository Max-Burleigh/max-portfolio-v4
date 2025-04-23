"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { throttle } from "lodash";
import AuroraBlob from "./components/AuroraBlob";
import Navigation from "./components/Navigation";
// Import modularized project components
import {
  Vinscribe,
  FullLeafTea,
  FullLeafApp,
  Quailmail,
  ShopDowntown,
  CarlyPhotography
} from "./components/projects";

// Main Portfolio component
const Portfolio = () => {
  // For optimized cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add springs for smoother cursor following
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullLeafMessageState, setFullLeafMessageState] = useState<"hidden" | "first" | "second">("hidden");

  // Define section keys type for type safety
  type SectionKey = "about" | "projects" | "contact";
  const sectionKeys: SectionKey[] = ["about", "projects", "contact"];

  // Create properly typed section refs
  const sectionRefs: Record<
    SectionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    about: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(e.clientX - 50);
      mouseY.set(e.clientY - 50);
    }, 10),
    [mouseX, mouseY]
  );

  // Memoized scroll section function
  const scrollToSection = useCallback(
    (section: SectionKey) => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    },
    [sectionRefs]
  );

  // Throttled scroll handler for better performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = throttle(() => {
      const scrollY = container.scrollTop;
      const viewportHeight = container.clientHeight;

      const offsets = Object.entries(sectionRefs).map(([key, ref]) => ({
        key: key as SectionKey,
        offset: ref.current ? ref.current.offsetTop : 0,
      }));

      // Find which section is most visible in the viewport
      const current = offsets.reduce<SectionKey>((acc, curr) => {
        return scrollY >= curr.offset - viewportHeight / 3 ? curr.key : acc;
      }, "about");

      if (current !== activeSection) {
        setActiveSection(current);
      }
    }, 100); // Throttle to run at most every 100ms

    container.addEventListener("scroll", handleScroll);
    // Initial check
    setTimeout(handleScroll, 100); // Small delay to ensure refs are populated

    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [activeSection, sectionRefs]);

  const handleFullLeafMouseEnter = () => {
    if (fullLeafMessageState === "hidden") {
      setFullLeafMessageState("first");
    }
  };

  const handleFullLeafClick = () => {
    if (fullLeafMessageState === "first") {
      setFullLeafMessageState("second");
    }
  };

  // Common blob props to reduce duplication
  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  };

  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora Animated Blobs - Reduced number and optimized */}
      <AuroraBlob
        className="blob1"
        initial={{ opacity: 0.5, scale: 1, x: -50, y: -50 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
          x: [-50, 0, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />
      <AuroraBlob
        className="blob2"
        initial={{ opacity: 0.4, scale: 1, x: 150, y: 50 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.3, 1],
          x: [150, 200, 150],
          y: [50, 150, 50],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />

      {/* Optimized cursor circle with useSpring for smoother motion */}
      <motion.div
        className="cursor-circle"
        style={{
          x: cursorX,
          y: cursorY,
          willChange: "transform",
        }}
      />

      {/* Use the new Navigation component */}
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        sections={sectionKeys}
      />

      {/* About Section - Reduced duplicate blobs */}
      <section
        ref={sectionRefs.about}
        id="about"
        className="section about-section"
      >
        <div className="glass-card about-card">
          <h1>Hey, I&apos;m Max Burleigh</h1>
          <p>
            web developer, project manager, solopreneur based in Medford, Oregon.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={sectionRefs.projects}
        id="projects"
        className="section projects-section"
      >
        <h2>Projects</h2>
        <div className="project-grid">
          <Vinscribe />
          <FullLeafTea 
            fullLeafMessageState={fullLeafMessageState}
            onMouseEnter={handleFullLeafMouseEnter}
            onClick={handleFullLeafClick}
          />
          <FullLeafApp />
          <Quailmail />
          <ShopDowntown />
          <CarlyPhotography />
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={sectionRefs.contact}
        id="contact"
        className="section contact-section"
      >
        <div className="glass-card contact-card">
          <h2>Contact</h2>
          <p>
            Feel free to reach out if you have a project in mind or just want to
            chat!
          </p>
          <a href="mailto:webwavebuilding@yahoo.com">webwavebuilding@yahoo.com</a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
