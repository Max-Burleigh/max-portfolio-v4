"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { throttle } from "lodash";
import Image from "next/image";
import { AuroraBlob } from "./components/aurora";
import { Navigation } from "./components/navigation";
// Import modularized project components
import {
  Vinscribe,
  FullLeafTea,
  FullLeafApp,
  Quailmail,
  ShopDowntown,
  CarlyPhotography,
} from "./components/projects";

// Helper functions for tilt calculations
const round = (num: number, fix = 2) => {
  return parseFloat(num.toFixed(fix));
};

const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Main Portfolio component
const Portfolio = () => {
  // For optimized cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add springs for smoother cursor following
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // For portrait tilt effect
  const portraitRef = useRef<HTMLDivElement>(null);
  const [rotations, setRotations] = useState({ x: 0, y: 0, z: 2 });
  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // Set the ref value whenever isAnimating changes
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullLeafMessageState, setFullLeafMessageState] = useState<
    "hidden" | "first" | "second"
  >("hidden");

  // Define section keys type for type safety
  type SectionKey = "about" | "projects" | "contact";
  const sectionKeys: SectionKey[] = ["about", "projects", "contact"];

  // Create properly typed section refs
  const sectionRefs: Record<
    SectionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    about: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(e.clientX - 50);
      mouseY.set(e.clientY - 50);
    }, 10),
    [mouseX, mouseY]
  );

  // Handler for portrait tilting with advanced glare effect
  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnimating(true);

    if (!portraitRef.current) return;

    const rect = portraitRef.current.getBoundingClientRect();

    // Get absolute mouse position relative to the card
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Calculate percentage position (0-100%)
    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    };

    // Calculate center-relative position (-50 to 50%)
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    // Set rotation values based on mouse position
    setRotations({
      x: round(center.x / 12), // X-axis rotation (reversed for intuitive mapping)
      y: round(-center.y / 16), // Y-axis rotation
      z: round(distance(percent.x, percent.y, 50, 50) / 20), // Z-rotation based on distance from center
    });

    // Update glare position to follow mouse
    setGlare({
      x: percent.x,
      y: percent.y,
      opacity: 0.25,
    });
  };

  // Reset tilt and glare when mouse leaves
  const handlePortraitMouseLeave = () => {
    setAnimating(false);

    setTimeout(() => {
      if (isAnimatingRef.current) return;

      setRotations({ x: 0, y: 0, z: 2 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, 100);
  };

  // Memoized scroll section function
  const scrollToSection = useCallback(
    (section: SectionKey) => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    },
    [sectionRefs]
  );

  // Throttled scroll handler for better performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = throttle(() => {
      const scrollY = container.scrollTop;
      const viewportHeight = container.clientHeight;

      const offsets = Object.entries(sectionRefs).map(([key, ref]) => ({
        key: key as SectionKey,
        offset: ref.current ? ref.current.offsetTop : 0,
      }));

      // Find which section is most visible in the viewport
      const current = offsets.reduce<SectionKey>((acc, curr) => {
        return scrollY >= curr.offset - viewportHeight / 3 ? curr.key : acc;
      }, "about");

      if (current !== activeSection) {
        setActiveSection(current);
      }
    }, 100); // Throttle to run at most every 100ms

    container.addEventListener("scroll", handleScroll);
    // Initial check
    setTimeout(handleScroll, 100); // Small delay to ensure refs are populated

    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [activeSection, sectionRefs]);

  const handleFullLeafMouseEnter = () => {
    if (fullLeafMessageState === "hidden") {
      setFullLeafMessageState("first");
    }
  };

  const handleFullLeafClick = () => {
    if (fullLeafMessageState === "first") {
      setFullLeafMessageState("second");
    }
  };

  // Common blob props to reduce duplication
  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  };

  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora Animated Blobs - Reduced number and optimized */}
      <AuroraBlob
        className="blob1"
        initial={{ opacity: 0.5, scale: 1, x: -50, y: -50 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
          x: [-50, 0, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />
      <AuroraBlob
        className="blob2"
        initial={{ opacity: 0.4, scale: 1, x: 150, y: 50 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.3, 1],
          x: [150, 200, 150],
          y: [50, 150, 50],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        {...blobProps}
      />

      {/* Optimized cursor circle with useSpring for smoother motion */}
      <motion.div
        className="cursor-circle"
        style={{
          x: cursorX,
          y: cursorY,
          willChange: "transform",
        }}
      />

      {/* Use the new Navigation component */}
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        sections={sectionKeys}
      />

      {/* About Section - Reduced duplicate blobs */}
      <section
        ref={sectionRefs.about}
        id="about"
        className="section about-section"
      >
        <div className="glass-card about-card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col">
              <h1>Hey, I&apos;m Max Burleigh</h1>
              <p>
                web developer, project manager, solopreneur based in Medford,
                Oregon.
              </p>
            </div>
            <motion.div
              ref={portraitRef}
              className="w-72 h-72 relative rounded-lg overflow-hidden shadow-lg"
              animate={{
                rotateY: rotations.x,
                rotateX: rotations.y,
                transformPerspective: rotations.z * 100,
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center",
                perspective: "800px",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              onMouseMove={handlePortraitMouseMove}
              onMouseLeave={handlePortraitMouseLeave}
            >
              {/* Glare overlay */}
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
                style={{
                  objectFit: "cover",
                  transform: "translateZ(20px)", // Add slight depth
                }}
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={sectionRefs.projects}
        id="projects"
        className="section projects-section"
      >
        <h2>Projects</h2>
        <div className="project-grid">
          <Vinscribe />
          <FullLeafTea
            fullLeafMessageState={fullLeafMessageState}
            onMouseEnter={handleFullLeafMouseEnter}
            onClick={handleFullLeafClick}
          />
          <FullLeafApp />
          <Quailmail />
          <ShopDowntown />
          <CarlyPhotography />
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={sectionRefs.contact}
        id="contact"
        className="section contact-section"
      >
        <div className="glass-card contact-card">
          <h2>Contact</h2>
          <p>
            Feel free to reach out if you have a project in mind or just want to
            chat!
          </p>
          <a href="mailto:webwavebuilding@yahoo.com">
            webwavebuilding@yahoo.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
