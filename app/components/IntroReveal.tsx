"use client";
import { useState } from "react";

// Always SSR the overlay; CSS (via html[data-intro-played]) decides visibility.
// Unmount after the animation completes to avoid keeping a fixed node around.
export default function IntroReveal() {
  const [done, setDone] = useState(false);
  if (done) return null;

  const handleEnd = () => {
    try {
      document.documentElement.setAttribute("data-intro-played", "1");
    } catch {}
    setDone(true);
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] intro-wash pointer-events-none"
      onAnimationEnd={handleEnd}
    >
      <div className="h-full w-full bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[2px]" />
    </div>
  );
}
