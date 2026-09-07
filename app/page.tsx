"use client";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./components/AuroraBackground.module.css";
import "./page.module.css";
import "./components/navigation/Navigation.module.css";
import "./sections/PortfolioSection.module.css";
import "./components/projects/ProjectCard.module.css";
import "./components/Phone.module.css";
import "./sections/ServicesSection.module.css";
import "./sections/ContactSection.module.css";
// import { throttle } from "lodash";
import { useIsMobile, useMediaQuery } from "@lib/hooks";
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
const TOUCH_SECTION_THRESHOLD_PX = 54;
const VIEWPORT_HEIGHT_SHRINK_THRESHOLD_PX = 12;
const SECTION_PRESSURE_ENABLE_PX = 24;
const SECTION_PRESSURE_DISABLE_PX = 8;
const SECTION_PRESSURE_RELEASE_GROWTH_PX = 32;
const ABOUT_SECTION_MIN_BLOCK_GAP_PX = 16;
// Keep the services experience available locally without publishing it.
const SHOW_SERVICES = process.env.NODE_ENV !== "production";

const getSectionScrollTop = (container: HTMLElement, target: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  return container.scrollTop + targetRect.top - containerRect.top;
};

const getActiveSectionLayoutPressure = (section: HTMLElement) => {
  const sectionRect = section.getBoundingClientRect();
  const primaryBlock = section.querySelector<HTMLElement>(
    ".about-stage, .services-cockpit, .portfolio-cockpit, .contact-cockpit"
  );
  let pressure = Math.max(0, section.scrollHeight - section.clientHeight);

  if (primaryBlock) {
    const blockRect = primaryBlock.getBoundingClientRect();
    pressure = Math.max(
      pressure,
      blockRect.bottom - sectionRect.bottom,
      sectionRect.top - blockRect.top,
      primaryBlock.scrollHeight - Math.max(primaryBlock.clientHeight, section.clientHeight)
    );
  }

  const aboutContent = section.querySelector<HTMLElement>(".about-stage-content");
  const heroActions = section.querySelector<HTMLElement>(".hero-actions");
  const heroStats = section.querySelector<HTMLElement>(".hero-stats");

  if (aboutContent) {
    pressure = Math.max(pressure, aboutContent.scrollHeight - aboutContent.clientHeight);
  }

  if (aboutContent && heroStats) {
    const contentRect = aboutContent.getBoundingClientRect();
    const statsRect = heroStats.getBoundingClientRect();
    pressure = Math.max(
      pressure,
      contentRect.bottom - statsRect.top + ABOUT_SECTION_MIN_BLOCK_GAP_PX
    );
  }

  if (heroActions && heroStats) {
    const actionsRect = heroActions.getBoundingClientRect();
    const statsRect = heroStats.getBoundingClientRect();
    pressure = Math.max(
      pressure,
      actionsRect.bottom - statsRect.top + ABOUT_SECTION_MIN_BLOCK_GAP_PX
    );
  }

  return pressure;
};

const getSectionPressureTargets = (section: HTMLElement) => [
  section,
  ...Array.from(
    section.querySelectorAll<HTMLElement>(
      [
        ".about-stage",
        ".about-stage-content",
        ".hero-copy",
        ".hero-actions",
        ".hero-stats",
        ".services-cockpit",
        ".service-plan-grid",
        ".portfolio-cockpit",
        ".portfolio-deck-shell",
        ".contact-cockpit",
        ".contact-panel",
      ].join(", ")
    )
  ),
];

// Main Portfolio component
const Portfolio = () => {
  // About section logic moved into AboutSection component
  // Mobile detection (for cursor circle overlay and menu overlay)
  const isMobile = useIsMobile();
  const isDesktopFinePointer = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 769px)"
  );
  const [hasUserHeightResizeFallback, setHasUserHeightResizeFallback] = useState(false);
  const [hasSectionOverflowFallback, setHasSectionOverflowFallback] = useState(false);
  const usesSectionScrollFallback = hasUserHeightResizeFallback || hasSectionOverflowFallback;
  const canUseSectionStack = true;
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
    () =>
      SHOW_SERVICES
        ? ["about", "services", "portfolio", "contact"]
        : ["about", "portfolio", "contact"],
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
  const sectionOverflowFallbackRef = useRef(false);
  const sectionOverflowTriggerHeightRef = useRef<number | null>(null);
  const isProgrammaticNativeScrollRef = useRef(false);
  const isNativeScrollSyncRef = useRef(false);
  const lastNativeScrollAtRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);
  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    sectionOverflowFallbackRef.current = hasSectionOverflowFallback;
  }, [hasSectionOverflowFallback]);

  useEffect(() => {
    if (!isDesktopFinePointer) {
      setHasUserHeightResizeFallback(false);
      return;
    }

    const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;
    const initialViewportHeight = getViewportHeight();

    const updateHeightResizeFallback = () => {
      const currentViewportHeight = getViewportHeight();
      const hasUserShrunkViewport =
        initialViewportHeight - currentViewportHeight >= VIEWPORT_HEIGHT_SHRINK_THRESHOLD_PX;

      setHasUserHeightResizeFallback(hasUserShrunkViewport);
    };

    updateHeightResizeFallback();
    window.addEventListener("resize", updateHeightResizeFallback);
    window.visualViewport?.addEventListener("resize", updateHeightResizeFallback);

    return () => {
      window.removeEventListener("resize", updateHeightResizeFallback);
      window.visualViewport?.removeEventListener("resize", updateHeightResizeFallback);
    };
  }, [isDesktopFinePointer]);

  useEffect(() => {
    if (!isDesktopFinePointer) {
      sectionOverflowFallbackRef.current = false;
      sectionOverflowTriggerHeightRef.current = null;
      setHasSectionOverflowFallback(false);
      return;
    }

    let syncFrame: number | undefined;
    const timeoutIds: number[] = [];
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => queuePressureCheck())
        : undefined;

    const getActiveSection = () => sectionRefs[activeSection]?.current;
    const getCardHeight = () =>
      document.querySelector<HTMLElement>(".portfolio-master-card")?.clientHeight ??
      Math.floor(window.visualViewport?.height ?? window.innerHeight);

    const updateSectionOverflowFallback = () => {
      syncFrame = undefined;
      const section = getActiveSection();
      if (!section) return;

      const pressure = getActiveSectionLayoutPressure(section);
      const isFallbackActive = sectionOverflowFallbackRef.current;
      const cardHeight = getCardHeight();
      let nextFallbackActive = isFallbackActive;

      if (!isFallbackActive && pressure > SECTION_PRESSURE_ENABLE_PX) {
        sectionOverflowTriggerHeightRef.current = cardHeight;
        nextFallbackActive = true;
      } else if (isFallbackActive) {
        const triggerHeight = sectionOverflowTriggerHeightRef.current;
        const hasRecoveredHeight =
          triggerHeight === null ||
          cardHeight - triggerHeight >= SECTION_PRESSURE_RELEASE_GROWTH_PX;

        if (hasRecoveredHeight && pressure <= SECTION_PRESSURE_DISABLE_PX) {
          sectionOverflowTriggerHeightRef.current = null;
          nextFallbackActive = false;
        }
      }

      if (nextFallbackActive !== isFallbackActive) {
        sectionOverflowFallbackRef.current = nextFallbackActive;
        setHasSectionOverflowFallback(nextFallbackActive);
      }
    };

    function queuePressureCheck() {
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }

      syncFrame = window.requestAnimationFrame(updateSectionOverflowFallback);
    }

    const observeCurrentSection = () => {
      const section = getActiveSection();
      resizeObserver?.disconnect();

      if (section) {
        getSectionPressureTargets(section).forEach((target) => {
          resizeObserver?.observe(target);
        });
      }

      queuePressureCheck();
    };

    observeCurrentSection();
    window.addEventListener("resize", observeCurrentSection);
    window.visualViewport?.addEventListener("resize", observeCurrentSection);

    [80, 220, 480, 900].forEach((delay) => {
      timeoutIds.push(window.setTimeout(observeCurrentSection, delay));
    });

    return () => {
      window.removeEventListener("resize", observeCurrentSection);
      window.visualViewport?.removeEventListener("resize", observeCurrentSection);
      resizeObserver?.disconnect();
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));

      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }
    };
  }, [activeSection, isDesktopFinePointer, sectionRefs]);

  useEffect(() => {
    let syncFrame: number | undefined;
    const timeoutIds: number[] = [];

    const syncCurrentSection = (force = false) => {
      if (canUseSectionStack) return;
      if (!force && Date.now() - lastNativeScrollAtRef.current < 320) return;
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }

      syncFrame = window.requestAnimationFrame(() => {
        syncFrame = undefined;
        const section = sectionRefs[activeRef.current]?.current;
        const container = containerRef.current;
        if (!section || !container) return;

        isProgrammaticNativeScrollRef.current = true;
        container.scrollTo({ top: getSectionScrollTop(container, section), left: 0, behavior: "auto" });
        window.setTimeout(() => {
          isProgrammaticNativeScrollRef.current = false;
        }, 80);
      });
    };

    const updateVisualViewportHeight = (forceSync = false) => {
      const visualHeight = Math.floor(window.visualViewport?.height ?? window.innerHeight);
      document.documentElement.style.setProperty("--portfolio-visual-vh", `${visualHeight}px`);
      syncCurrentSection(forceSync);
    };

    const handleViewportResize = () => updateVisualViewportHeight(false);
    const handleOrientationChange = () => updateVisualViewportHeight(true);

    updateVisualViewportHeight(true);

    window.addEventListener("resize", handleViewportResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.visualViewport?.addEventListener("resize", handleViewportResize);

    [120, 420, 900].forEach((delay) => {
      timeoutIds.push(window.setTimeout(() => updateVisualViewportHeight(true), delay));
    });

    return () => {
      window.removeEventListener("resize", handleViewportResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }
    };
  }, [canUseSectionStack, sectionRefs]);

  useEffect(() => {
    if (canUseSectionStack) return;
    if (isNativeScrollSyncRef.current) {
      isNativeScrollSyncRef.current = false;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const section = sectionRefs[activeSection]?.current;
      const container = containerRef.current;
      const isPageScrollMode =
        document.querySelector(".site-stage-shell")?.getAttribute("data-section-mode") === "native-scroll";

      if (section && isPageScrollMode) {
        isProgrammaticNativeScrollRef.current = true;
        section.scrollIntoView({ block: "start", behavior: "smooth" });
        window.setTimeout(() => {
          isProgrammaticNativeScrollRef.current = false;
        }, 700);
      } else if (section && container) {
        isProgrammaticNativeScrollRef.current = true;
        container.scrollTo({ top: getSectionScrollTop(container, section), left: 0, behavior: "smooth" });
        window.setTimeout(() => {
          isProgrammaticNativeScrollRef.current = false;
        }, 700);
      }

      section
        ?.querySelectorAll<HTMLElement>(
          ".about-stage, .services-cockpit, .portfolio-cockpit, .contact-cockpit"
        )
        .forEach((element) => {
          element.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSection, canUseSectionStack, sectionRefs]);

  useEffect(() => {
    if (canUseSectionStack) return;

    const scrollParent = containerRef.current;
    if (!scrollParent) return;
    const isPageScrollMode =
      document.querySelector(".site-stage-shell")?.getAttribute("data-section-mode") === "native-scroll";

    let syncFrame: number | undefined;

    const findNearestSection = () => {
      if (isPageScrollMode) {
        const anchorTop = window.innerHeight * 0.38;

        return sectionKeys.reduce(
          (nearest, section) => {
            const node = sectionRefs[section]?.current;
            if (!node) return nearest;

            const rect = node.getBoundingClientRect();
            const distance = Math.abs(rect.top - anchorTop);
            return distance < nearest.distance ? { section, distance } : nearest;
          },
          { section: activeRef.current, distance: Number.POSITIVE_INFINITY }
        ).section;
      }

      const currentTop = scrollParent.scrollTop;
      return sectionKeys.reduce(
        (nearest, section) => {
          const node = sectionRefs[section]?.current;
          if (!node) return nearest;

          const distance = Math.abs(getSectionScrollTop(scrollParent, node) - currentTop);
          return distance < nearest.distance ? { section, distance } : nearest;
        },
        { section: activeRef.current, distance: Number.POSITIVE_INFINITY }
      ).section;
    };

    const syncActiveSection = () => {
      syncFrame = undefined;
      if (isProgrammaticNativeScrollRef.current) return;

      const nearestSection = findNearestSection();
      if (nearestSection === activeRef.current) return;

      isNativeScrollSyncRef.current = true;
      setActiveSection(nearestSection);
    };

    const handleScroll = () => {
      lastNativeScrollAtRef.current = Date.now();
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }
      syncFrame = window.requestAnimationFrame(syncActiveSection);
    };

    const scrollTarget: HTMLElement | Window = isPageScrollMode ? window : scrollParent;
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }
    };
  }, [canUseSectionStack, sectionKeys, sectionRefs]);

  useEffect(() => {
    const resetHashScroll = () => {
      if (!window.location.hash) return;

      const hashSection = window.location.hash.slice(1);
      if (!sectionKeys.includes(hashSection as SectionKey)) return;

      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      setActiveSection("about");

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        containerRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    };

    resetHashScroll();
    window.addEventListener("hashchange", resetHashScroll);
    return () => window.removeEventListener("hashchange", resetHashScroll);
  }, [sectionKeys]);

  // Portrait tilt/glare logic is encapsulated inside AboutSection now

  const scrollToSection = useCallback(
    (section: SectionKey) => {
      const targetElement = sectionRefs[section]?.current;
      if (!targetElement) return;

      if (!canUseSectionStack) {
        isNativeScrollSyncRef.current = true;
        setActiveSection(section);
        isProgrammaticNativeScrollRef.current = true;
        const isPageScrollMode =
          document.querySelector(".site-stage-shell")?.getAttribute("data-section-mode") === "native-scroll";
        const container = containerRef.current;

        if (isPageScrollMode) {
          targetElement.scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (container) {
          container.scrollTo({ top: getSectionScrollTop(container, targetElement), left: 0, behavior: "smooth" });
        }
        window.setTimeout(() => {
          isProgrammaticNativeScrollRef.current = false;
        }, 640);
        return;
      }

      setActiveSection(section);
    },
    [canUseSectionStack, sectionRefs]
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

  // Keyboard navigation for the focused card. Only intercepts in stack mode;
  // native-scroll mode lets the browser own arrow/page/home/end.
  const handleContainerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (usesSectionScrollFallback) return;
      if (!canUseSectionStack) return;

      // Don't hijack keys while typing in a form field.
      if (event.target instanceof HTMLElement) {
        const formField = event.target.closest("input, textarea, select, [contenteditable='true']");
        if (formField) return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        setActiveSection(sectionKeys[Math.min(sectionKeys.length - 1, activeIndex + 1)]);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        setActiveSection(sectionKeys[Math.max(0, activeIndex - 1)]);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveSection(sectionKeys[0]);
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveSection(sectionKeys[sectionKeys.length - 1]);
      }
    },
    [activeIndex, canUseSectionStack, usesSectionScrollFallback, sectionKeys]
  );

  const canScrollVerticallyWithin = useCallback(
    (target: EventTarget | null, direction: number) => {
      const scrollParent = containerRef.current;
      if (!(target instanceof Element) || !scrollParent) return false;

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
    },
    []
  );

  const goToSectionByOffset = useCallback(
    (offset: number) => {
      const currentIndex = Math.max(0, sectionKeys.indexOf(activeRef.current));
      const nextIndex = Math.max(
        0,
        Math.min(sectionKeys.length - 1, currentIndex + offset)
      );

      if (nextIndex !== currentIndex) {
        setActiveSection(sectionKeys[nextIndex]);
      }
    },
    [sectionKeys]
  );

  const handleContainerTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, target: event.target };
  }, []);

  const handleContainerTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (usesSectionScrollFallback) return;
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absY < TOUCH_SECTION_THRESHOLD_PX || absY <= absX * 1.2) return;

      const direction = deltaY < 0 ? 1 : -1;
      if (canScrollVerticallyWithin(start.target, direction)) return;

      goToSectionByOffset(direction);
    },
    [canScrollVerticallyWithin, goToSectionByOffset, usesSectionScrollFallback]
  );

  useEffect(() => {
    if (usesSectionScrollFallback) return;
    if (!canUseSectionStack) return;
    const scrollParent = containerRef.current;
    if (!scrollParent) return;

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
  }, [canScrollVerticallyWithin, canUseSectionStack, usesSectionScrollFallback, sectionKeys, setActiveSection]);

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

      <main
        className="site-stage-shell"
        data-section-mode={usesSectionScrollFallback ? "section-scroll" : "stack"}
      >
        <div
          className="portfolio-master-card"
          data-active-section={activeSection}
          data-section-mode={usesSectionScrollFallback ? "section-scroll" : "stack"}
        >
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
            aria-orientation="vertical"
            aria-valuemax={sectionKeys.length}
            aria-valuemin={1}
            aria-valuenow={activeIndex + 1}
            aria-valuetext={`${activeIndex + 1} of ${sectionKeys.length}: ${activeSection}`}
            className={`section-scrollbar${isScrollbarDragging ? " is-dragging" : ""}`}
            onKeyDown={handleScrollbarKeyDown}
            onPointerDown={handleScrollbarPointerDown}
            role="scrollbar"
            tabIndex={usesSectionScrollFallback ? -1 : 0}
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
            tabIndex={canUseSectionStack ? 0 : -1}
            onKeyDown={handleContainerKeyDown}
            onTouchEnd={handleContainerTouchEnd}
            onTouchStart={handleContainerTouchStart}
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
              style={
                canUseSectionStack
                  ? { transform: `translate3d(0, -${activeIndex * 100}%, 0)` }
                  : undefined
              }
            >
              <AboutSection
                ref={sectionRefs.about}
                onViewPortfolio={() => scrollToSection("portfolio")}
                onContact={() => scrollToSection("contact")}
              />

              {SHOW_SERVICES && <ServicesSection ref={sectionRefs.services} />}

              <PortfolioSection
                ref={sectionRefs.portfolio}
                useNativeDesktopScroll={usesSectionScrollFallback}
              />

              <ContactSection ref={sectionRefs.contact} />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Portfolio;
