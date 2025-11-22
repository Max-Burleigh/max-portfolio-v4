"use client";

import { useEffect, useState } from "react";

/**
 * iOS 26 Safari viewport bug overlay fallback
 * 
 * On iOS 26, fixed/full-screen elements sometimes don't paint behind the Safari URL bar,
 * leaving gray strips even when the page background is correct. This overlay forces Safari
 * to repaint those areas with the proper background color.
 * 
 * Rendered conditionally only on iOS devices to avoid unnecessary overhead on other platforms.
 */
export default function IOSViewportOverlay() {
  const [isIOS, setIsIOS] = useState(false);
  const [height, setHeight] = useState("100vh");

  useEffect(() => {
    // Detect iOS devices
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/i.test(ua);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      const updateHeight = () => {
        // Use outerHeight to cover the full screen including browser chrome areas
        setHeight(`${window.outerHeight}px`);
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      window.addEventListener("orientationchange", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
        window.removeEventListener("orientationchange", updateHeight);
      };
    }
  }, []);

  if (!isIOS) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-[5]" style={{ height }}>
      <div className="h-full bg-[var(--background)]" style={{ height: "100%" }} />
    </div>
  );
}
