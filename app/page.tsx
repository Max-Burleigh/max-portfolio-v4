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
import { AuroraBlob, CanvasAurora } from "./components/aurora"; // Keep this import for non-iOS, CanvasAurora for iOS
import { Navigation } from "./components/navigation";
import PlatformDetector from "./components/PlatformDetector";
// Import modularized project components
import {
  Vinscribe,
  FullLeafTea,
  FullLeafWholesale,
  FullLeafApp,
  Quailmail,
  ShopDowntown,
  CarlyPhotography,
  BasedChat,
} from "./components/projects";
import { SiLinkedin } from "react-icons/si";

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
  // Use motion values instead of state for better performance
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const transformPerspective = useMotionValue(200); // z * 100
  // Add springs for smoother rotation
  const rotateYSpring = useSpring(rotateY, { damping: 30, stiffness: 300 });
  const rotateXSpring = useSpring(rotateX, { damping: 30, stiffness: 300 });
  const transformPerspectiveSpring = useSpring(transformPerspective, {
    damping: 28,
    stiffness: 320,
  });

  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // For the expanding "spiel" section
  const [spielOpen, setSpielOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // State for iOS detection
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Detect iOS after component mount by checking the body class
  useEffect(() => {
    // Check for iOS after a small delay to ensure PlatformDetector has run
    const checkIOSClass = () => {
      if (typeof document !== "undefined") {
        setIsIOS(document.body.classList.contains("is-ios-device"));
      }
    };

    // Check immediately and after a short delay to be sure
    checkIOSClass();
    const timeoutId = setTimeout(checkIOSClass, 50);

    return () => clearTimeout(timeoutId);
  }, []);

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
  const [fullLeafWholesaleMessageState, setFullLeafWholesaleMessageState] =
    useState<"hidden" | "first" | "second">("hidden");
  const [vinscribeMessageState, setVinscribeMessageState] = useState<
    "hidden" | "first" | "second"
  >("hidden");
  const [carlyMessageState, setCarlyMessageState] = useState<
    "hidden" | "first" | "second"
  >("hidden");
  const [shopDowntownMessageState, setShopDowntownMessageState] = useState<
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
      const center = {
        x: percent.x - 50,
        y: percent.y - 50,
      };

      // Update motion values directly instead of setting state
      rotateY.set(round(center.x / 12));
      rotateX.set(round(-center.y / 16));
      transformPerspective.set(
        round(distance(percent.x, percent.y, 50, 50) / 20) * 100
      );

      setGlare({
        x: percent.x,
        y: percent.y,
        opacity: 0.25,
      });
    },
    [rotateY, rotateX, transformPerspective, setGlare]
  );

  const throttledPortraitMouseMove = useMemo(
    () => throttle(handlePortraitMouseMove, 16), // ~60fps
    [handlePortraitMouseMove]
  );

  const handlePortraitMouseLeave = () => {
    setAnimating(false);
    isAnimatingRef.current = false;
    // Reset motion values directly
    rotateY.set(0);
    rotateX.set(0);
    transformPerspective.set(200); // z(2) * 100
    setGlare({ x: 50, y: 50, opacity: 0 });
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

  const handleFullLeafWholesaleMouseEnter = () => {
    if (fullLeafWholesaleMessageState === "hidden") {
      setFullLeafWholesaleMessageState("first");
    }
  };

  const handleFullLeafWholesaleClick = () => {
    if (fullLeafWholesaleMessageState === "first") {
      setFullLeafWholesaleMessageState("second");
    }
  };

  const handleVinscribeMouseEnter = () => {
    if (vinscribeMessageState === "hidden") {
      setVinscribeMessageState("first");
    }
  };

  const handleVinscribeClick = () => {
    if (vinscribeMessageState === "first") {
      setVinscribeMessageState("second");
    }
  };

  const handleCarlyMouseEnter = () => {
    if (carlyMessageState === "hidden") {
      setCarlyMessageState("first");
    }
  };

  const handleCarlyClick = () => {
    if (carlyMessageState === "first") {
      setCarlyMessageState("second");
    }
  };

  const handleShopDowntownMouseEnter = () => {
    if (shopDowntownMessageState === "hidden") {
      setShopDowntownMessageState("first");
    }
  };

  const handleShopDowntownClick = () => {
    if (shopDowntownMessageState === "first") {
      setShopDowntownMessageState("second");
    }
  };

  const blobProps = {
    style: { zIndex: 0, willChange: "transform, opacity" },
  };

  return (
    <>
      <PlatformDetector />
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        sections={sectionKeys}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <motion.div
        ref={containerRef}
        className="portfolio-container"
        onMouseMove={throttledMouseMove}
      >
        <div className="aurora-bg" />

        {/* Add overlay when mobile menu is open */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* AuroraBlobs will be shown/hidden via CSS based on body.is-ios-device class */}
        {/* Keeping the !isIOS condition as a secondary check for optimization */}
        {!isIOS && (
          <>
            <AuroraBlob
              className="blob1 aurora-blob"
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
              className="blob2 aurora-blob"
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
        {isIOS && <CanvasAurora />}

        {/* 
          REMOVED THE DUPLICATE NAVIGATION COMPONENT FROM HERE.
          The primary Navigation component is already rendered outside this scrollable container.
        */}

        {!isMobile && (
          <motion.div
            className="cursor-circle"
            style={{
              x: cursorX,
              y: cursorY,
              willChange: "transform",
            }}
          />
        )}

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
                          height: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                          },
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
                          I believe as we head towards a world where AI is
                          writing more and more of our code, we will need
                          forward-thinking individuals like myself that can
                          think critically and creatively to solve problems.
                          Hopefully you'll find me best to do this!
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
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
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
            <Vinscribe
              vinscribeMessageState={vinscribeMessageState}
              onMouseEnter={handleVinscribeMouseEnter}
              onClick={handleVinscribeClick}
            />
            <FullLeafTea
              fullLeafMessageState={fullLeafMessageState}
              onMouseEnter={handleFullLeafMouseEnter}
              onClick={handleFullLeafClick}
            />
            <FullLeafWholesale
              fullLeafWholesaleMessageState={fullLeafWholesaleMessageState}
              onMouseEnter={handleFullLeafWholesaleMouseEnter}
              onClick={handleFullLeafWholesaleClick}
            />
            <FullLeafApp />
            <Quailmail />
            <ShopDowntown
              shopDowntownMessageState={shopDowntownMessageState}
              onMouseEnter={handleShopDowntownMouseEnter}
              onClick={handleShopDowntownClick}
            />
            <CarlyPhotography
              carlyMessageState={carlyMessageState}
              onMouseEnter={handleCarlyMouseEnter}
              onClick={handleCarlyClick}
            />
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
              Feel free to reach out if you have a project in mind or just want
              to chat!
            </p>
            <div className="mt-4">
              <a href="mailto:webwavebuilding@yahoo.com">
                webwavebuilding@yahoo.com
              </a>
              <div className="flex justify-center w-full">
                <a
                  href="https://www.linkedin.com/in/max-burleigh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-2 text-blue-500 hover:text-blue-700 transition-colors font-medium"
                  style={{ width: "fit-content" }}
                >
                  <SiLinkedin style={{ width: 22, height: 22 }} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Portfolio;
