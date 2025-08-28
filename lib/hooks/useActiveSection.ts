"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rafThrottle } from "@utils/rafThrottle";

export function useActiveSection<K extends string>(
  sectionRefs: Record<K, React.RefObject<HTMLElement | null>>, // refs to sections
  containerRef?: React.RefObject<HTMLElement | null> // optional scroll container
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

      // 1) Prefer the section that CONTAINS the anchor (with safe zone)
      let found: K | null = null;
      for (const s of entries) {
        const rect = s.el.getBoundingClientRect();
        if (rect.top + safeZonePx <= aY && rect.bottom - safeZonePx >= aY) {
          found = s.key;
          break;
        }
      }

      // 2) Fallback: nearest section boundary to the anchor
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
    if (containerEl) containerEl.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
      if (containerEl) containerEl.removeEventListener("scroll", onScroll as EventListener);
    };
  }, [keys, sectionRefs, containerRef]);

  return { activeSection, setActiveSection } as const;
}
