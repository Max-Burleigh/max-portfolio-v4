"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { throttle } from "lodash";
import { useActiveSection, useIsMobile, useCursorFollower } from "@lib/hooks";
import AuroraBackground from "@components/AuroraBackground";
import Navigation from "@components/navigation/Navigation";
import AboutSection from "@sections/AboutSection";
import ProjectsSection from "@sections/ProjectsSection";
import ContactSection from "@sections/ContactSection";
// Import modularized project components
//

// Main Portfolio component
const Portfolio = () => {
  // For optimized cursor following
  const { cursorX, cursorY, handleMouseMove } = useCursorFollower({ damping: 25, stiffness: 700 });

  // About section logic moved into AboutSection component
  // Mobile detection (for cursor circle overlay and menu overlay)
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  // Guard to prevent the opening tap from immediately closing via overlay
  const [overlayReady, setOverlayReady] = useState(false);

  // State for iOS detection removed; handled via SSR class on <html>

  // isMobile is derived via media query hook

  // Removed client iOS detection; CSS gates backgrounds by <html> class

  // Set portfolio container height to exact viewport height (for iOS Safari overscroll fix)
  // useEffect(() => {
  //   const portfolioContainer = containerRef.current;

  //   const setRealViewportHeight = () => {
  //     if (portfolioContainer) {
  //       portfolioContainer.style.height = `${window.innerHeight}px`;
  //     }
  //   };

  //   if (typeof window !== "undefined") {
  //     window.addEventListener("resize", setRealViewportHeight);
  //     window.addEventListener("orientationchange", setRealViewportHeight);
  //     setRealViewportHeight();

  //     const timeoutId = setTimeout(setRealViewportHeight, 100);

  //     return () => {
  //       window.removeEventListener("resize", setRealViewportHeight);
  //       window.removeEventListener("orientationchange", setRealViewportHeight);
  //       clearTimeout(timeoutId);
  //     };
  //   }
  // }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  // Removed unused card message states

  type SectionKey = "about" | "projects" | "contact";
  const sectionKeys: SectionKey[] = ["about", "projects", "contact"];

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => ({
      about: aboutSectionRef,
      projects: projectsSectionRef,
      contact: contactSectionRef,
    }),
    [aboutSectionRef, projectsSectionRef, contactSectionRef]
  );

  const { activeSection, setActiveSection } = useActiveSection(
    { about: aboutSectionRef, projects: projectsSectionRef, contact: contactSectionRef },
    containerRef
  );

  const throttledMouseMove = handleMouseMove;

  // Portrait tilt/glare logic is encapsulated inside AboutSection now

  const scrollToSection = useCallback(
    (section: SectionKey) => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    },
    [sectionRefs]
  );

  // Active section logic moved into useActiveSection hook

  // Remove unused hover/click message state and handlers

  // Aurora animation props handled inside AuroraBackground

  // Avoid mobile overlay immediately capturing the opening tap
  React.useEffect(() => {
    let t: number | undefined;
    if (menuOpen) {
      setOverlayReady(false);
      // Defer overlay click handling slightly to avoid click-through
      t = window.setTimeout(() => setOverlayReady(true), 180);
    } else {
      setOverlayReady(false);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [menuOpen]);

  return (
    <>
      {/* PlatformDetector removed; SSR sets <html> classes */}
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        sections={sectionKeys}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setActiveSection={setActiveSection}
      />
      <motion.div
        ref={containerRef}
        className="portfolio-container"
        onMouseMove={throttledMouseMove}
      >
        {/* Add overlay when mobile menu is open */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${
                overlayReady ? "" : "pointer-events-none"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => overlayReady && setMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Always render both backgrounds; CSS on <html> decides visibility */}
        <AuroraBackground />

        {/* 
          REMOVED THE DUPLICATE NAVIGATION COMPONENT FROM HERE.
          The primary Navigation component is already rendered outside this scrollable container.
        */}

        {!isMobile && (
          <motion.div
            className="cursor-circle"
            style={{
              x: cursorX,
              y: cursorY,
              willChange: "transform",
            }}
          />
        )}

        <AboutSection ref={sectionRefs.about} />

        <ProjectsSection ref={sectionRefs.projects} />

        <ContactSection ref={sectionRefs.contact} />
      </motion.div>
    </>
  );
};

export default Portfolio;
