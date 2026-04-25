"use client";
import React, { useRef, useState, useCallback, useMemo, forwardRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdArrowForward, MdCode, MdMood, MdOutlineMail, MdRocketLaunch, MdStar } from "react-icons/md";
import { rafThrottle, useIsMobile, useEntranceStagger, useMicroParallax } from "@lib/hooks";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { projects } from "@/content/projects";

const round = (num: number, fix = 2) => parseFloat(num.toFixed(fix));
interface AboutSectionProps {
  onViewPortfolio?: () => void;
  onContact?: () => void;
}

const visibleProjectCount = projects.filter((project) => !project.hidden).length;
const githubUrl = "https://github.com/maxburleigh";

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(function AboutSection({ onViewPortfolio, onContact }, ref) {
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
  const entranceRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
    <section ref={ref} id="about" className="section about-section relative w-screen min-h-dvh mx-auto flex flex-col justify-center items-center z-[2]">
      <div className="portfolio-stage about-stage">
        <header className="stage-topline" aria-label="Portfolio identity and social links">
          <a href="#about" className="stage-wordmark" aria-label="Max Burleigh home">
            <span>Max</span>
            <span>Burleigh</span>
          </a>
          <div className="stage-socials" aria-label="Social links">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <SiLinkedin aria-hidden="true" />
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <SiGithub aria-hidden="true" />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Max">
              <MdOutlineMail aria-hidden="true" />
            </a>
          </div>
        </header>

        <div
          ref={entranceRef}
          data-entrance="hero"
          className="about-stage-content"
        >
          <div className="hero-copy">
            <p data-entrance-item className="hero-eyebrow">
              Hey there <span aria-hidden="true">👋</span>
            </p>
            <h1 ref={titleRef} data-entrance-item className="hero-title">
              I&apos;m Max<br />Burleigh
            </h1>
            <div data-entrance-item className="hero-title-rule" aria-hidden="true" />
            <p data-entrance-item className="hero-subcopy">
              Web designer & developer helping businesses grow in{" "}
              <span>Medford, Oregon</span>.
            </p>

            <div className="hero-actions" data-entrance-item>
              <motion.button
                type="button"
                onClick={onViewPortfolio}
                className="hero-button hero-button-primary"
                whileHover={{ scale: 1.035, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View My Work</span>
                <MdArrowForward aria-hidden="true" />
              </motion.button>
              <motion.button
                type="button"
                onClick={onContact}
                className="hero-button hero-button-secondary"
                whileHover={{ scale: 1.035, x: 2 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Let&apos;s Talk</span>
                <MdOutlineMail aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          <div data-entrance-item className="flex-shrink-0">
            <motion.div
              ref={portraitRef}
              className="portrait-frame hero-portrait"
              style={{
                rotateY: rotateYSpring,
                rotateX: rotateXSpring,
                transformPerspective: transformPerspectiveSpring,
                boxShadow,
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
                src="/new-headshot-portfolio.png"
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

        <div className="hero-stats" data-entrance="stats">
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdRocketLaunch aria-hidden="true" /></span>
            <span className="hero-stat-value">5+</span>
            <span className="hero-stat-label">Years Experience</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdCode aria-hidden="true" /></span>
            <span className="hero-stat-value">{visibleProjectCount}</span>
            <span className="hero-stat-label">Projects Featured</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdMood aria-hidden="true" /></span>
            <span className="hero-stat-value">40+</span>
            <span className="hero-stat-label">Happy Clients</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdStar aria-hidden="true" /></span>
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Commitment</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
