"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { throttle } from "lodash";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuroraBlob } from "./components/aurora"; // Keep this import
import { Navigation } from "./components/navigation";
// Import modularized project components
import {
  Vinscribe,
  FullLeafTea,
  FullLeafApp,
  Quailmail,
  ShopDowntown,
  CarlyPhotography,
  BasedChat,
} from "./components/projects";

// Helper functions for tilt calculations
const round = (num: number, fix = 2) => {
  return parseFloat(num.toFixed(fix));
};

const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Define an interface for window that includes the MSStream property
interface WindowWithMSStream extends Window {
  MSStream?: unknown; // Use unknown for better type safety than any, or a more specific type if known
}

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

  // For the expanding "spiel" section
  const [spielOpen, setSpielOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // For the construction notice popup
  const [showNotice, setShowNotice] = useState(true);

  // New state for iOS detection
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // useEffect for iOS detection
  useEffect(() => {
    // Ensure this code runs only on the client-side
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent;
      // Basic iOS detection, using the extended Window type
      const typedWindow = window as WindowWithMSStream;
      const iosCheck =
        /iPad|iPhone|iPod/.test(userAgent) && !typedWindow.MSStream;
      setIsIOS(iosCheck);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Set portfolio container height to exact viewport height (for iOS Safari overscroll fix)
  useEffect(() => {
    const portfolioContainer = containerRef.current;

    const setRealViewportHeight = () => {
      if (portfolioContainer) {
        portfolioContainer.style.height = `${window.innerHeight}px`;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", setRealViewportHeight);
      window.addEventListener("orientationchange", setRealViewportHeight);
      setRealViewportHeight();

      const timeoutId = setTimeout(setRealViewportHeight, 100);

      return () => {
        window.removeEventListener("resize", setRealViewportHeight);
        window.removeEventListener("orientationchange", setRealViewportHeight);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullLeafMessageState, setFullLeafMessageState] = useState<
    "hidden" | "first" | "second"
  >("hidden");

  type SectionKey = "about" | "projects" | "contact";
  const sectionKeys: SectionKey[] = ["about", "projects", "contact"];

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => ({
      about: aboutSectionRef,
      projects: projectsSectionRef,
      contact: contactSectionRef,
    }),
    [aboutSectionRef, projectsSectionRef, contactSectionRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(e.clientX - 50);
      mouseY.set(e.clientY - 50);
    },
    [mouseX, mouseY]
  );

  const throttledMouseMove = useMemo(
    () => throttle(handleMouseMove, 10),
    [handleMouseMove]
  );

  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };
    setRotations({
      x: round(center.x / 12),
      y: round(-center.y / 16),
      z: round(distance(percent.x, percent.y, 50, 50) / 20),
    });
    setGlare({
      x: percent.x,
      y: percent.y,
      opacity: 0.25,
    });
  };

  const handlePortraitMouseLeave = () => {
    setAnimating(false);
    setTimeout(() => {
      if (isAnimatingRef.current) return;
      setRotations({ x: 0, y: 0, z: 2 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, 100);
  };

  const scrollToSection = useCallback(
    (section: SectionKey) => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    },
    [sectionRefs]
  );

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
      const current = offsets.reduce<SectionKey>((acc, curr) => {
        return scrollY >= curr.offset - viewportHeight / 3 ? curr.key : acc;
      }, "about");
      if (current !== activeSection) {
        setActiveSection(current);
      }
    }, 100);
    container.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
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

  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  };

  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      onMouseMove={throttledMouseMove}
    >
      <div
        className="aurora-bg"
        style={isIOS ? { background: "#2d174d" } : {}}
      />

      {!isIOS && (
        <>
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
        </>
      )}

      <motion.div
        className="cursor-circle"
        style={{
          x: cursorX,
          y: cursorY,
          willChange: "transform",
        }}
      />

      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        sections={sectionKeys}
      />

      <section
        ref={sectionRefs.about}
        id="about"
        className="section about-section"
      >
        <div className="glass-card about-card">
          <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
            <div className="flex flex-col max-w-md flex-1 min-w-0">
              <h1>Hey, I'm Max Burleigh</h1>
              <p>
                web developer, project manager, solopreneur based in Medford,
                Oregon.
              </p>
              <motion.button
                onClick={() => setSpielOpen(!spielOpen)}
                className="mt-4 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 rounded-full text-white font-semibold text-shadow-sm self-start overflow-hidden relative text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">
                  {spielOpen
                    ? "That's enough about me..."
                    : "Click for a detailed spiel ✨"}
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
                      height: "auto",
                      transition: {
                        height: { type: "spring", stiffness: 100, damping: 15 },
                        opacity: { duration: 0.4, delay: 0.2 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3 spiel-detail">
                      <p className="text-xs md:text-sm">
                        I'm 30 years old, I have 2 amazing children who are my
                        world, and I reside in Southern Oregon!
                      </p>
                      <p className="text-xs md:text-sm">
                        I consider myself highly detail-oriented, but I have a
                        ferocious appetite for getting things done. This is an
                        important set of traits that I have found to be useful
                        in my career.
                      </p>
                      <p className="text-xs md:text-sm">
                        I believe as we head towards a world where AI is writing
                        more and more of our code, we will need forward-thinking
                        individuals like myself that can think critically and
                        creatively to solve problems. Hopefully you'll find me
                        best to do this!
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
              animate={{
                rotateY: rotations.x,
                rotateX: rotations.y,
                transformPerspective: rotations.z * 100,
                scale: isMobile && spielOpen ? 0.8 : 1,
              }}
              transition={{ duration: 0.5 }}
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
                  transform: "translateZ(20px)",
                }}
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

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
          <BasedChat />
        </div>
      </section>

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

      <AnimatePresence>
        {showNotice && (
          <motion.div
            className="fixed bottom-4 left-0 right-0 mx-auto w-11/12 sm:w-96 bg-black/70 backdrop-blur-md p-3 rounded-lg shadow-lg z-50 border border-purple-500/30"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-white/90">
                Site uploaded 3-16-2025 - still under construction, performance
                may be buggy.
              </p>
              <button
                onClick={() => setShowNotice(false)}
                className="ml-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close notice"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
