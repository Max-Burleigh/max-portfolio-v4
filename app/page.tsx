"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { throttle } from "lodash";
import { useActiveSection, useIsMobile, useCursorFollower } from "@lib/hooks";
import AuroraBackground from "@components/AuroraBackground";
import IOSViewportOverlay from "@components/IOSViewportOverlay";
import Navigation from "@components/navigation/Navigation";
import AboutSection from "@sections/AboutSection";
import PortfolioSection from "@sections/PortfolioSection";
import ServicesSection from "@sections/ServicesSection";
import ContactSection from "@sections/ContactSection";
// Import modularized project components
//

// Main Portfolio component
const Portfolio = () => {
  // For optimized cursor following
  const { cursorX, cursorY, handleMouseMove, cursorOpacity } = useCursorFollower({ damping: 25, stiffness: 700 });

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

  type SectionKey = "about" | "services" | "portfolio" | "contact";
  const sectionKeys: SectionKey[] = ["about", "services", "portfolio", "contact"];

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => ({
      about: aboutSectionRef,
      services: servicesSectionRef,
      portfolio: portfolioSectionRef,
      contact: contactSectionRef,
    }),
    [aboutSectionRef, portfolioSectionRef, servicesSectionRef, contactSectionRef]
  );

  const { activeSection, setActiveSection } = useActiveSection(
    { about: aboutSectionRef, services: servicesSectionRef, portfolio: portfolioSectionRef, contact: contactSectionRef },
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

  // Inquiry State
  const [inquiryData, setInquiryData] = useState<{ plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean } | null>(null);

  const handleStartProject = (data: { plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean }) => {
    setInquiryData(data);
    const target = sectionRefs.contact.current ?? document.getElementById("contact");
    if (!target) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 24;
    const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

    // Run once, after the sticky bar begins unmounting, to avoid a stop-start feel
    requestAnimationFrame(() => window.setTimeout(() => {
      window.scrollTo({ top, behavior });
    }, 120));
  };

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
      {/* iOS 26 Safari viewport overlay fallback */}
      <IOSViewportOverlay />

      {/* Always render both backgrounds; CSS on <html> decides visibility */}
      {/* Moved outside of motion.div to ensure fixed positioning works correctly relative to viewport */}
      <AuroraBackground />

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
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${overlayReady ? "" : "pointer-events-none"
                }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => overlayReady && setMenuOpen(false)}
            />
          )}
        </AnimatePresence>



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
              opacity: cursorOpacity,
              willChange: "transform, opacity",
            }}
          />
        )}

        <AboutSection ref={sectionRefs.about} onViewServices={() => scrollToSection("services")} />

        <ServicesSection ref={sectionRefs.services} onStartProject={handleStartProject} />

        <PortfolioSection ref={sectionRefs.portfolio} />

        <ContactSection ref={sectionRefs.contact} inquiryData={inquiryData} />
      </motion.div>
    </>
  );
};

export default Portfolio;
