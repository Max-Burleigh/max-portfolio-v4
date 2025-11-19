"use client";
import React, { useRef, useState, useCallback, useMemo, forwardRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform, useMotionTemplate } from "framer-motion";
import { rafThrottle, useIsMobile, useEntranceStagger, useMicroParallax } from "@lib/hooks";

const round = (num: number, fix = 2) => parseFloat(num.toFixed(fix));
interface AboutSectionProps {
  onViewServices?: () => void;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(function AboutSection({ onViewServices }, ref) {
  // Local mobile detection for layout tweaks
  const isMobile = useIsMobile();

  // Tilt effect state
  const portraitRef = useRef<HTMLDivElement>(null);
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  // Increase base perspective to 1000px for realistic 3D (200px was fisheye)
  // Revised: 600px for more dramatic 3D effect without fisheye
  const transformPerspective = useMotionValue(600);

  // Use slightly heavier, critical damping for a "premium glass" feel
  const rotateYSpring = useSpring(rotateY, { damping: 20, stiffness: 150 });
  const rotateXSpring = useSpring(rotateX, { damping: 20, stiffness: 150 });
  const transformPerspectiveSpring = useSpring(transformPerspective, {
    damping: 30,
    stiffness: 200,
  });

  // Dynamic shadow based on tilt (lift effect)
  const shadowX = useTransform(rotateYSpring, (val) => -val * 2);
  const shadowY = useTransform(rotateXSpring, (val) => val * 2 + 10);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 24px rgba(0, 0, 0, 0.4)`;

  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [spielOpen, setSpielOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const entranceRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Measure the spiel content height when open so we can animate numeric height
  // Simplified: measure once after open (next frame), and on viewport resize (throttled).
  useLayoutEffect(() => {
    if (!spielOpen) {
      setContentHeight(0);
      return;
    }
    const el = contentRef.current;
    if (!el) return;

    const rafId = requestAnimationFrame(() => {
      setContentHeight(el.scrollHeight);
    });

    const onResize = rafThrottle(() => {
      if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    });
    window.addEventListener("resize", onResize as EventListener);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize as EventListener);
    };
  }, [spielOpen]);

  const handlePortraitMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setAnimating(true);
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const absolute = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const percent = {
        x: round((100 / rect.width) * absolute.x),
        y: round((100 / rect.height) * absolute.y),
      };
      const center = { x: percent.x - 50, y: percent.y - 50 };
      // Increased rotation range: /6 instead of /12, and /8 instead of /16
      rotateY.set(round(center.x / 6));
      rotateX.set(round(-center.y / 8));
      // Keep perspective stable at 1000px for realistic 3D
      transformPerspective.set(1000);
      setGlare({ x: percent.x, y: percent.y, opacity: 0.4 });
    },
    [rotateY, rotateX, transformPerspective]
  );

  const throttledPortraitMouseMove = useMemo(
    () => rafThrottle<React.MouseEvent<HTMLDivElement>>(handlePortraitMouseMove),
    [handlePortraitMouseMove]
  );

  const handlePortraitMouseLeave = () => {
    setAnimating(false);
    isAnimatingRef.current = false;
    rotateY.set(0);
    rotateX.set(0);
    transformPerspective.set(1000);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  // Entrance stagger for hero elements (runs after intro reveal completes)
  useEntranceStagger(entranceRef, { baseDelay: 0, step: 90 });
  // Micro parallax on the main heading (disabled on mobile)
  useMicroParallax(titleRef, { maxPx: 12, factor: 0.015, disabled: isMobile });

  return (
    <section ref={ref} id="about" className="section about-section">
      <div className="glass-card about-card">
        <div
          ref={entranceRef}
          data-entrance="hero"
          className="flex flex-col md:flex-row items-center md:items-start md:gap-6"
        >
          <div className="flex flex-col max-w-md flex-1 min-w-0">
            <h1 ref={titleRef} data-entrance-item>
              Hey, I'm Max Burleigh
            </h1>
            <p data-entrance-item>
              web designer & developer helping businesses grow in medford, oregon.
            </p>
            <div className="mt-4 flex flex-wrap gap-3" data-entrance-item>
              <motion.button
                onClick={() => setSpielOpen(!spielOpen)}
                className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 rounded-full text-white font-semibold text-shadow-sm self-start overflow-hidden relative text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-entrance-item
              >
                <span className="relative z-10">
                  {spielOpen ? "That's enough about me..." : "Click for a detailed spiel ✨"}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-400 to-blue-400"
                  style={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <motion.button
                type="button"
                onClick={useCallback(() => onViewServices?.(), [onViewServices])}
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/40 text-white/80 font-semibold text-sm md:text-base bg-white/5 backdrop-saturate-150 shadow-[0_0_30px_rgba(0,0,0,0.25)] hover:border-white/70 hover:text-white/100 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                data-entrance-item
              >
                <span className="relative z-10">See how I can help</span>
              </motion.button>
            </div>
            <AnimatePresence>
              {spielOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: contentHeight,
                    transition: {
                      height: { type: "spring", stiffness: 100, damping: 15 },
                      opacity: { duration: 0.4, delay: 0.2 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
                  }}
                  className="overflow-hidden"
                  style={{
                    contain: "layout paint",
                    willChange: "height, opacity",
                    transform: "translateZ(0)",
                  }}
                >
                  <div ref={contentRef} className="pt-4 space-y-3 spiel-detail">
                    <p className="text-xs md:text-sm">
                      I'm 31 years old, I have 2 amazing children who are my world, and I reside in Southern Oregon!
                    </p>
                    <p className="text-xs md:text-sm">
                      I consider myself highly detail-oriented, but I have a ferocious appetite for getting things done. This is an important set of traits that I have found to be useful in my career.
                    </p>
                    <p className="text-xs md:text-sm">
                      I believe as we head towards a world where AI is writing more and more of our code, we will need forward-thinking individuals like myself that can think critically and creatively to solve problems. I'm excited about the opportunity to contribute my skills and passion to your organization (or project)!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div data-entrance-item className="flex-shrink-0">
            <motion.div
              ref={portraitRef}
              className={`portrait-frame w-64 h-80 md:w-80 md:h-96 relative rounded-lg overflow-hidden shadow-lg ${spielOpen ? "" : "mt-4 md:mt-0"
                }`}
              style={{
                rotateY: rotateYSpring,
                rotateX: rotateXSpring,
                transformPerspective: transformPerspectiveSpring,
                boxShadow,
                scale: isMobile && spielOpen ? 0.8 : 1,
                transformStyle: "preserve-3d",
                transformOrigin: "center",
                willChange: "transform",
              }}
              initial={false}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onMouseMove={throttledPortraitMouseMove}
              onMouseLeave={handlePortraitMouseLeave}
            >
              <motion.div
                style={{
                  zIndex: 2,
                  mixBlendMode: "overlay",
                  position: "absolute",
                  transform: "translateZ(1px)",
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.5rem",
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  background: `radial-gradient(
                  farthest-corner circle at ${glare.x}% ${glare.y}%,
                  rgba(255, 255, 255, 0.8) 10%,
                  rgba(255, 255, 255, 0.65) 20%,
                  rgba(0, 0, 0, 0.5) 90%
                )`,
                  opacity: glare.opacity,
                }}
              />
              <Image
                src="/candidate-2.webp"
                alt="Max Burleigh"
                fill
                sizes="(max-width: 768px) 256px, 320px"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMTkxYzIzIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+"
                className="portrait-image"
                style={{ objectFit: "cover", transform: "translateZ(20px)", borderRadius: "0.5rem" }}
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
