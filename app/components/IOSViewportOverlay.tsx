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

  useEffect(() => {
    // Detect iOS devices
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/i.test(ua));
  }, []);

  if (!isIOS) return null;

  return (
    <div className="ios-viewport-overlay">
      <div className="ios-viewport-overlay-bg" />
    </div>
  );
}
