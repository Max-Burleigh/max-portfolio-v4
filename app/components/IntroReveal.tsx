"use client";
import { useEffect, useState } from "react";

// Always SSR the overlay; CSS (via html[data-intro-played]) decides visibility.
// Unmount after the animation completes to avoid keeping a fixed node around.
export default function IntroReveal() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body as unknown as { inert?: boolean } & HTMLElement;

    const update = () => {
      const played = html.getAttribute("data-intro-played") === "1";
      if (!played) {
        if ("inert" in body) {
          // Progressive enhancement: block interactions until reveal completes
          // CSS fallbacks remain in place regardless of inert support
          (body as any).inert = true;
        }
      } else {
        if ("inert" in body) {
          (body as any).inert = false;
        }
        setDone(true);
      }
    };

    update();
    const mo = new MutationObserver(() => update());
    mo.observe(html, { attributes: true, attributeFilter: ["data-intro-played"] });
    return () => mo.disconnect();
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] intro-wash pointer-events-none"
      onAnimationEnd={() => {
        try {
          document.documentElement.setAttribute("data-intro-played", "1");
        } catch {}
      }}
    >
      <div className="h-full w-full bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[2px]" />
    </div>
  );
}
