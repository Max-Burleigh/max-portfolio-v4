"use client";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { throttle } from "lodash";
import { useIsMobile } from "@lib/hooks";
import AuroraBackground from "@components/AuroraBackground";
import IOSViewportOverlay from "@components/IOSViewportOverlay";
import Navigation from "@components/navigation/Navigation";
import AboutSection from "@sections/AboutSection";
import PortfolioSection from "@sections/PortfolioSection";
import ServicesSection from "@sections/ServicesSection";
import ContactSection from "@sections/ContactSection";
// Import modularized project components
//

const SECTION_TRANSITION_MS = 640;

// Main Portfolio component
const Portfolio = () => {
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
  const sectionKeys = useMemo<SectionKey[]>(
    () => ["about", "services", "portfolio", "contact"],
    []
  );

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

  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const activeIndex = Math.max(0, sectionKeys.indexOf(activeSection));
  const [draggedScrollbarIndex, setDraggedScrollbarIndex] = useState<number | null>(null);
  const [isScrollbarDragging, setIsScrollbarDragging] = useState(false);
  const activeRef = useRef<SectionKey>(activeSection);
  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  // Portrait tilt/glare logic is encapsulated inside AboutSection now

  const scrollToSection = useCallback(
    (section: SectionKey) => {
      const targetElement = sectionRefs[section]?.current;
      if (!targetElement) return;

      setActiveSection(section);
      if (isMobile) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    },
    [isMobile, sectionRefs]
  );

  const handleScrollbarPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isMobile || (event.pointerType === "mouse" && event.button !== 0)) return;

      event.preventDefault();
      event.currentTarget.focus();

      const track = event.currentTarget;
      const rect = track.getBoundingClientRect();
      const thumbHeight = rect.height / sectionKeys.length;
      const currentIndex = Math.max(0, sectionKeys.indexOf(activeRef.current));
      const currentThumbTop = currentIndex * thumbHeight;
      const startedOnThumb =
        event.target instanceof Element &&
        Boolean(event.target.closest(".section-scrollbar-thumb"));
      const grabOffset = startedOnThumb
        ? Math.max(0, Math.min(thumbHeight, event.clientY - rect.top - currentThumbTop))
        : thumbHeight / 2;

      const updateDragPosition = (clientY: number) => {
        const maxThumbTop = Math.max(0, rect.height - thumbHeight);
        const nextThumbTop = Math.max(
          0,
          Math.min(maxThumbTop, clientY - rect.top - grabOffset)
        );
        const nextProgress = maxThumbTop > 0
          ? (nextThumbTop / maxThumbTop) * (sectionKeys.length - 1)
          : 0;
        const nextIndex = Math.max(
          0,
          Math.min(sectionKeys.length - 1, Math.round(nextProgress))
        );

        setDraggedScrollbarIndex(nextProgress);
        setActiveSection(sectionKeys[nextIndex]);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        moveEvent.preventDefault();
        updateDragPosition(moveEvent.clientY);
      };

      const stopDragging = (upEvent: PointerEvent) => {
        upEvent.preventDefault();
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", stopDragging);
        window.removeEventListener("pointercancel", stopDragging);
        setDraggedScrollbarIndex(null);
        setIsScrollbarDragging(false);
      };

      setIsScrollbarDragging(true);
      updateDragPosition(event.clientY);
      window.addEventListener("pointermove", handlePointerMove, { passive: false });
      window.addEventListener("pointerup", stopDragging);
      window.addEventListener("pointercancel", stopDragging);
    },
    [isMobile, sectionKeys]
  );

  const handleScrollbarKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isMobile) return;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        setActiveSection(sectionKeys[Math.min(sectionKeys.length - 1, activeIndex + 1)]);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        setActiveSection(sectionKeys[Math.max(0, activeIndex - 1)]);
      }

      if (event.key === "Home") {
        event.preventDefault();
        setActiveSection(sectionKeys[0]);
      }

      if (event.key === "End") {
        event.preventDefault();
        setActiveSection(sectionKeys[sectionKeys.length - 1]);
      }
    },
    [activeIndex, isMobile, sectionKeys]
  );

  // Inquiry State
  const [inquiryData, setInquiryData] = useState<{ plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean } | null>(null);

  const handleStartProject = (data: { plan: "ESSENTIAL" | "GROWTH" | null; subscription: boolean }) => {
    setInquiryData(data);
    const target = sectionRefs.contact.current ?? document.getElementById("contact");
    if (!target) return;

    const scrollToContact = () => {
      setActiveSection("contact");
      if (isMobile) {
        target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    };

    // Wait one frame for inquiry state to render before targeting the section.
    requestAnimationFrame(() => {
      scrollToContact();
    });
  };

  useEffect(() => {
    const scrollParent = containerRef.current;
    if (!scrollParent) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!canHover.matches) return;

    let accumulatedDelta = 0;
    let isAnimating = false;
    let resetAccumulatorTimer: number | undefined;
    let releaseAnimationTimer: number | undefined;

    const normalizeWheelDelta = (event: WheelEvent) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return event.deltaY * 18;
      }

      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return event.deltaY * scrollParent.clientHeight;
      }

      return event.deltaY;
    };

    const resetAccumulatorSoon = () => {
      if (resetAccumulatorTimer) {
        window.clearTimeout(resetAccumulatorTimer);
      }
      resetAccumulatorTimer = window.setTimeout(() => {
        accumulatedDelta = 0;
      }, 160);
    };

    const canScrollVerticallyWithin = (target: EventTarget | null, direction: number) => {
      if (!(target instanceof Element)) return false;

      let el: Element | null = target;
      while (el && el !== scrollParent) {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          const canOverflowY = /(auto|scroll)/.test(style.overflowY);

          if (canOverflowY && el.scrollHeight > el.clientHeight + 1) {
            const atTop = el.scrollTop <= 1;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
            if ((direction < 0 && !atTop) || (direction > 0 && !atBottom)) {
              return true;
            }
          }
        }

        el = el.parentElement;
      }

      return false;
    };

    const releaseAnimation = () => {
      isAnimating = false;
      accumulatedDelta = 0;
    };

    const snapToIndex = (index: number) => {
      isAnimating = true;
      setActiveSection(sectionKeys[index]);
      if (releaseAnimationTimer) {
        window.clearTimeout(releaseAnimationTimer);
      }
      releaseAnimationTimer = window.setTimeout(releaseAnimation, SECTION_TRANSITION_MS + 140);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const isHorizontalGesture = absX > absY;
      if (isHorizontalGesture) {
        accumulatedDelta = 0;
        return;
      }

      const normalizedDelta = normalizeWheelDelta(event);
      if (Math.abs(normalizedDelta) < 2) return;

      const direction = normalizedDelta > 0 ? 1 : -1;
      if (canScrollVerticallyWithin(event.target, direction)) {
        accumulatedDelta = 0;
        return;
      }

      if (isAnimating) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      accumulatedDelta += normalizedDelta;
      resetAccumulatorSoon();

      const intentThreshold = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 52 : 1;
      if (Math.abs(accumulatedDelta) < intentThreshold) return;

      const currentIndex = Math.max(0, sectionKeys.indexOf(activeRef.current));
      const nextIndex = Math.max(
        0,
        Math.min(sectionKeys.length - 1, currentIndex + direction)
      );

      accumulatedDelta = 0;
      if (nextIndex === currentIndex) return;

      snapToIndex(nextIndex);
    };

    scrollParent.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollParent.removeEventListener("wheel", handleWheel);
      if (resetAccumulatorTimer) {
        window.clearTimeout(resetAccumulatorTimer);
      }
      if (releaseAnimationTimer) {
        window.clearTimeout(releaseAnimationTimer);
      }
    };
  }, [sectionKeys, setActiveSection]);

  // Active section is state-driven so desktop wheel navigation never fights native scroll.

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

      <main className="site-stage-shell">
        <div className="portfolio-master-card">
          {/* PlatformDetector removed; SSR sets <html> classes */}
          <Navigation
            activeSection={activeSection}
            scrollToSection={scrollToSection}
            sections={sectionKeys}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setActiveSection={setActiveSection}
          />
          <div
            aria-label="Section navigation"
            aria-controls="portfolio-sections"
            aria-valuemax={sectionKeys.length}
            aria-valuemin={1}
            aria-valuenow={activeIndex + 1}
            className={`section-scrollbar${isScrollbarDragging ? " is-dragging" : ""}`}
            onKeyDown={handleScrollbarKeyDown}
            onPointerDown={handleScrollbarPointerDown}
            role="scrollbar"
            tabIndex={0}
          >
            <div
              className="section-scrollbar-thumb"
              style={{
                height: `${100 / sectionKeys.length}%`,
                transform: `translate3d(0, ${(draggedScrollbarIndex ?? activeIndex) * 100}%, 0)`,
              }}
            />
          </div>
          <motion.div
            ref={containerRef}
            id="portfolio-sections"
            className="portfolio-container"
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

            <div
              className="portfolio-sections"
              style={{
                transform: isMobile
                  ? undefined
                  : `translate3d(0, -${activeIndex * 100}%, 0)`,
              }}
            >
              <AboutSection
                ref={sectionRefs.about}
                onViewPortfolio={() => scrollToSection("portfolio")}
                onContact={() => scrollToSection("contact")}
              />

              <ServicesSection
                ref={sectionRefs.services}
                isActive={activeSection === "services"}
                onStartProject={handleStartProject}
              />

              <PortfolioSection ref={sectionRefs.portfolio} />

              <ContactSection ref={sectionRefs.contact} inquiryData={inquiryData} />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Portfolio;
