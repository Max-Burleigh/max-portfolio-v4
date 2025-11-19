"use client";
// Unified hooks and utilities: useActiveSection, useCursorFollower, useIsMobile, rafThrottle
// This centralizes hooks to simplify imports and avoid deep trees.

import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

// ===== rafThrottle =====
export function rafThrottle(fn: () => void): () => void;
export function rafThrottle<T>(fn: (arg: T) => void): (arg: T) => void;
export function rafThrottle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void
): (...args: TArgs) => void {
  let running = false;
  return (...args: TArgs) => {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      fn(...args);
      running = false;
    });
  };
}

// ===== useMediaQuery / useIsMobile =====
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

// ===== useCursorFollower =====
export function useCursorFollower(spring = { damping: 25, stiffness: 700 }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorOpacity = useMotionValue(0); // Start hidden

  const cursorX = useSpring(mouseX, spring);
  const cursorY = useSpring(mouseY, spring);
  const cursorOpacitySpring = useSpring(cursorOpacity, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleLeave = () => cursorOpacity.set(0);
    const handleEnter = () => cursorOpacity.set(1);

    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [cursorOpacity]);

  const handleMouseMove = useMemo(
    () =>
      rafThrottle<React.MouseEvent<HTMLDivElement>>((e) => {
        mouseX.set(e.clientX - 50);
        mouseY.set(e.clientY - 50);
        // Ensure cursor is visible when moving
        cursorOpacity.set(1);
      }),
    [mouseX, mouseY, cursorOpacity]
  );

  return { cursorX, cursorY, handleMouseMove, cursorOpacity: cursorOpacitySpring } as const;
}

// ===== useActiveSection =====
export function useActiveSection<K extends string>(
  sectionRefs: Record<K, React.RefObject<HTMLElement | null>>,
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const keys = useMemo(() => Object.keys(sectionRefs) as K[], [sectionRefs]);
  const [activeSection, setActiveSection] = useState<K>(keys[0]);
  const activeRef = useRef<K>(keys[0]);

  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const entries = keys
      .map((k) => ({ key: k, el: sectionRefs[k].current }))
      .filter((s): s is { key: K; el: HTMLElement } => !!s.el);

    if (entries.length === 0) return;

    const anchorY = () => window.innerHeight * 0.45; // 45% from top
    const safeZonePx = 24; // must be this far inside a section before switching

    const updateActive = () => {
      const aY = anchorY();
      let found: K | null = null;
      for (const s of entries) {
        const rect = s.el.getBoundingClientRect();
        if (rect.top + safeZonePx <= aY && rect.bottom - safeZonePx >= aY) {
          found = s.key;
          break;
        }
      }
      if (!found) {
        let best: K = activeRef.current;
        let bestDist = Number.POSITIVE_INFINITY;
        for (const s of entries) {
          const rect = s.el.getBoundingClientRect();
          const dist = Math.min(
            Math.abs(rect.top - aY),
            Math.abs(rect.bottom - aY)
          );
          if (dist < bestDist) {
            bestDist = dist;
            best = s.key;
          }
        }
        found = best;
      }
      if (found && found !== activeRef.current) {
        setActiveSection(found);
      }
    };

    const onScroll = rafThrottle(updateActive);
    const onResize = rafThrottle(updateActive);

    const containerEl = containerRef?.current ?? undefined;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (containerEl)
      containerEl.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
      if (containerEl)
        containerEl.removeEventListener("scroll", onScroll as EventListener);
    };
  }, [keys, sectionRefs, containerRef]);

  return { activeSection, setActiveSection } as const;
}

// ===== Entrance Stagger =====
type EntranceOptions = {
  selector?: string;
  baseDelay?: number; // ms
  step?: number; // ms
};

export function useEntranceStagger<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  { selector = "[data-entrance-item]", baseDelay = 0, step = 90 }: EntranceOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const apply = () => {
      const items = Array.from(
        container.querySelectorAll<HTMLElement>(selector)
      );
      items.forEach((el, i) => {
        const delay = Math.max(0, baseDelay + i * step);
        el.style.setProperty("--enter-delay", `${delay}ms`);
      });
      // Flip the entered class next task to allow initial styles to commit
      const id = window.setTimeout(() => {
        container.classList.add("is-entered");
      }, prefersReduced ? 0 : 20);
      return () => window.clearTimeout(id);
    };

    // If an intro overlay gates initial paint, wait for it to complete
    const html = document.documentElement;
    if (html.getAttribute("data-intro-played") === "1") {
      return apply();
    }

    let cleanup: (() => void) | undefined;
    const observer = new MutationObserver(() => {
      if (html.getAttribute("data-intro-played") === "1") {
        cleanup?.();
        observer.disconnect();
        cleanup = apply();
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-intro-played"] });

    // Fallback timeout in case attribute never flips
    const fallback = window.setTimeout(() => {
      observer.disconnect();
      cleanup = apply();
    }, 2000);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
      cleanup?.();
    };
  }, [containerRef, selector, baseDelay, step]);
}

// ===== Micro Parallax =====
type ParallaxOptions = {
  factor?: number; // proportion of viewport offset -> px
  maxPx?: number; // clamp in pixels
  disabled?: boolean;
};

export function useMicroParallax<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  { factor = 0.015, maxPx = 12, disabled = false }: ParallaxOptions = {}
) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el || disabled) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centerOffset = rect.top + rect.height / 2 - vh / 2; // px from center
      const raw = centerOffset * factor;
      const clamped = Math.max(-maxPx, Math.min(maxPx, raw));
      el.style.setProperty("--parallax-y", `${clamped.toFixed(2)}px`);
    };

    const onScroll = rafThrottle(compute);
    const onResize = rafThrottle(compute);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
    };
  }, [targetRef, factor, maxPx, disabled]);
}
