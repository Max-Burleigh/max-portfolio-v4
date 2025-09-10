"use client";
import React, { useRef, useState, useCallback, useMemo, forwardRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { rafThrottle, useIsMobile } from "@lib/hooks";

const round = (num: number, fix = 2) => parseFloat(num.toFixed(fix));
const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const AboutSection = forwardRef<HTMLDivElement>(function AboutSection(_, ref) {
  // Local mobile detection for layout tweaks
  const isMobile = useIsMobile();

  // Tilt effect state
  const portraitRef = useRef<HTMLDivElement>(null);
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const transformPerspective = useMotionValue(200);
  const rotateYSpring = useSpring(rotateY, { damping: 30, stiffness: 300 });
  const rotateXSpring = useSpring(rotateX, { damping: 30, stiffness: 300 });
  const transformPerspectiveSpring = useSpring(transformPerspective, {
    damping: 28,
    stiffness: 320,
  });

  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [spielOpen, setSpielOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

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
      rotateY.set(round(center.x / 12));
      rotateX.set(round(-center.y / 16));
      transformPerspective.set(
        round(distance(percent.x, percent.y, 50, 50) / 20) * 100
      );
      setGlare({ x: percent.x, y: percent.y, opacity: 0.25 });
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
    transformPerspective.set(200);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <section ref={ref} id="about" className="section about-section">
      <div className="glass-card about-card">
        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
          <div className="flex flex-col max-w-md flex-1 min-w-0">
            <h1>Hey, I'm Max Burleigh</h1>
            <p>web developer, project manager, solopreneur based in Medford, Oregon.</p>
            <motion.button
              onClick={() => setSpielOpen(!spielOpen)}
              className="mt-4 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 rounded-full text-white font-semibold text-shadow-sm self-start overflow-hidden relative text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          <motion.div
            ref={portraitRef}
            className={`w-64 h-80 md:w-80 md:h-96 relative rounded-lg overflow-hidden shadow-lg flex-shrink-0 ${
              spielOpen ? "" : "mt-4 md:mt-0"
            }`}
            style={{
              rotateY: rotateYSpring,
              rotateX: rotateXSpring,
              transformPerspective: transformPerspectiveSpring,
              scale: isMobile && spielOpen ? 0.8 : 1,
              transformStyle: "preserve-3d",
              transformOrigin: "center",
              perspective: "800px",
            }}
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
              animate={{
                background: `radial-gradient(
                  farthest-corner circle at ${glare.x}% ${glare.y}%,
                  rgba(255, 255, 255, 0.7) 10%,
                  rgba(255, 255, 255, 0.5) 24%,
                  rgba(0, 0, 0, 0.8) 82%
                )`,
                opacity: glare.opacity,
              }}
            />
            <Image
              src="/candidate-2.webp"
              alt="Max Burleigh"
              fill
              style={{ objectFit: "cover", transform: "translateZ(20px)", borderRadius: "0.5rem" }}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
