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

  const cursorX = useSpring(mouseX, spring);
  const cursorY = useSpring(mouseY, spring);

  const handleMouseMove = useMemo(
    () =>
      rafThrottle<React.MouseEvent<HTMLDivElement>>((e) => {
        mouseX.set(e.clientX - 50);
        mouseY.set(e.clientY - 50);
      }),
    [mouseX, mouseY]
  );

  return { cursorX, cursorY, handleMouseMove } as const;
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

