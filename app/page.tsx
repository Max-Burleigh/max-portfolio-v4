"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { throttle } from "lodash";
import AuroraBlob from "./AuroraBlob";
import InteractiveIframe from "./components/InteractiveIframe";
import Image from "next/image";
import { SiTypescript, SiTailwindcss, SiHtml5, SiCss3, SiJavascript, SiGoogle, SiPhp, SiFirebase, SiNextdotjs } from "react-icons/si";
import ModernWindowsIcon from "./components/ModernWindowsIcon";

// Define prop types for the NavItem component
interface NavItemProps {
  section: string;
  activeSection: string;
  onClick: () => void;
}

// Memoized NavItem component
const NavItem = memo(({ section, activeSection, onClick }: NavItemProps) => {
  const isActive = section === activeSection;

  // Underline variants for the elastic effect
  const underlineVariants = {
    inactive: { scaleX: 0 },
    active: {
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
  };

  return (
    <div className="nav-item">
      <button className={isActive ? "active" : ""} onClick={onClick}>
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </button>
      <motion.div
        className="elastic-underline"
        variants={underlineVariants}
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
      />
    </div>
  );
});
NavItem.displayName = "NavItem";

// Main Portfolio component
const Portfolio = () => {
  // For optimized cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add springs for smoother cursor following
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullLeafMessageState, setFullLeafMessageState] = useState<"hidden" | "first" | "second">("hidden");

  // Define section keys type for type safety
  type SectionKey = "about" | "projects" | "contact";

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

      {/* Navigation with memoized components */}
      <nav className="side-nav">
        {["about", "projects", "contact"].map((section) => (
          <NavItem
            key={section}
            section={section}
            activeSection={activeSection}
            onClick={() => scrollToSection(section as SectionKey)}
          />
        ))}
      </nav>


      {/* About Section - Reduced duplicate blobs */}
      <section
        ref={sectionRefs.about}
        id="about"
        className="section about-section"
      >
        <div className="glass-card about-card">
          <h1>Hey, I&apos;m Max Burleigh</h1>
          <p>
            web developer, project manager, solopreneur based in Medford, Oregon.
          </p>
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
          <div className="project-card vinscribe-card">
            <div className="project-info">
              <a
                href="https://www.vinscribe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>VINSCRIBE</strong>
              </a>
              <p>AI-driven vehicle history reports and automotive tools.</p>
              <div
                className="tech-stack"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" /> Next.js
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiFirebase className="tech-icon firebase" style={{ width: "32px", height: "32px" }} color="#fff" /> Firebase
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiTypescript
                    className="tech-icon typescript"
                    style={{ width: "32px", height: "32px" }}
                    color="#fff"
                  />{" "}
                  TypeScript
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiTailwindcss
                    className="tech-icon tailwind"
                    style={{ width: "32px", height: "32px" }}
                    color="#fff"
                  />{" "}
                  TailwindCSS
                </span>
              </div>
            </div>
            <div className="phone-mockup">
              <InteractiveIframe
                src="https://www.vinscribe.com"
                title="VINSCRIBE Mobile Preview"
                className="vinscribe-iframe"
              />
            </div>
          </div>
          <div
            className="project-card fullleaf-card vinscribe-card"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexBasis: "100%",
              maxWidth: "100%",
              padding: "1.5rem",
              minHeight: "400px",
            }}
          >
            <div className="project-info">
              <a
                href="https://fullleafteacompany.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Full Leaf Tea Company</strong>
              </a>
              <p>
                Multi-million dollar ecommerce business for premium loose leaf tea.
              </p>
              <br />
              <p>
                Designed/developed by yours truly.
              </p>
              <br />
              <div
                className="tech-stack"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiHtml5 className="tech-icon html5" style={{ width: "32px", height: "32px" }} /> HTML
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiCss3 className="tech-icon css3" style={{ width: "32px", height: "32px" }} color="#fff" /> CSS
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiJavascript className="tech-icon javascript" style={{ width: "32px", height: "32px" }} color="#fff" /> JavaScript
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    minHeight: "32px"
                  }}
                >
                  <Image src="/klaviyo.png" alt="Klaviyo" width={38} height={38} className="tech-icon klaviyo" /> Klaviyo
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    minHeight: "32px"
                  }}
                >
                  <SiGoogle className="tech-icon google" style={{ width: "32px", height: "32px" }} /> Google Ads
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                    minHeight: "32px"
                  }}
                >
                  <ModernWindowsIcon className="tech-icon windows" style={{ width: "32px", height: "32px" }} /> Microsoft Ads
                </span>
              </div>
            </div>
            <div
              className="phone-mockup"
              style={{ position: 'relative', cursor: 'pointer' }}
              onMouseEnter={handleFullLeafMouseEnter}
              onClick={handleFullLeafClick}
            >
              <Image
                src="/full-leaf.jpg"
                alt="Screenshot of Full Leaf Tea Company website"
                title="Full Leaf Tea Company Website Screenshot"
                width={300}
                height={600}
                className="fullleaf-screenshot"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
              />
              <AnimatePresence>
                {fullLeafMessageState !== "hidden" && (
                  <motion.div
                    className="iframe-message fullleaf-message"
                    style={{ pointerEvents: fullLeafMessageState === "second" ? "auto" : "none" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-content">
                      <div className="message-icon">🫖</div>
                      <p>Try tapping harder.</p>
                      <AnimatePresence>
                        {fullLeafMessageState === "second" && (
                          <motion.p
                            key="second-message"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginTop: 8 }}
                          >
                            Just kidding, it's just a picture.<br />
                            <a href="https://fullleafteacompany.com" target="_blank" rel="noopener noreferrer">
                              Click to visit the website
                            </a>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="project-card">
            <strong>Full Leaf App</strong>
            <p>A Flutter-based, WebView app for Full Leaf Tea Company.</p>
          </div>
          <div className="project-card">
            <strong>Quailmail</strong>
            <p>An autonomous AI email agent.</p>
          </div>
          <div
            className="project-card shopdowntown-card vinscribe-card"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexBasis: "100%",
              maxWidth: "100%",
              padding: "1.5rem",
              minHeight: "400px",
            }}
          >
            <div className="project-info">
              <a
                href="https://shopdowntown.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Shop Downtown</strong>
              </a>
              <p>
                Community-driven online marketplace for local businesses.
              </p>
              <div
                className="tech-stack"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiHtml5 className="tech-icon html5" style={{ width: "32px", height: "32px" }} /> HTML
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiTailwindcss
                    className="tech-icon tailwind"
                    style={{ width: "32px", height: "32px" }}
                    color="#fff"
                  />{" "}
                  TailwindCSS
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiPhp className="tech-icon php" style={{ width: "32px", height: "32px" }} /> PHP
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiJavascript className="tech-icon javascript" style={{ width: "32px", height: "32px" }} color="#fff" /> JavaScript
                </span>
              </div>
            </div>
            <div className="phone-mockup">
              <InteractiveIframe
                src="https://shopdowntown.org/"
                title="Shop Downtown Mobile Preview"
                className="shopdowntown-iframe vinscribe-iframe"
              />
            </div>
          </div>
          <div
            className="project-card carlypsphoto-card"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexBasis: "100%",
              maxWidth: "100%",
              padding: "1.5rem",
              minHeight: "400px",
            }}
          >
            <div className="project-info">
              <a
                href="https://carlypsphoto.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Carly Pearl-Sacks Photography</strong>
              </a>
              <p>
                Portfolio site for a professional photographer.<br />
                Built with Next.js and TailwindCSS.
              </p>
              <div
                className="tech-stack"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <Image src="/next.svg" alt="Next.js" width={32} height={32} className="tech-icon nextjs" /> Next.js
                </span>
                <span
                  className="tech-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  }}
                >
                  <SiTailwindcss
                    className="tech-icon tailwind"
                    style={{ width: "32px", height: "32px" }}
                    color="#fff"
                  />{" "}
                  TailwindCSS
                </span>
              </div>
            </div>
            <div className="phone-mockup">
              <InteractiveIframe
                src="https://carlypsphoto.com"
                title="Carly Pearl-Sacks Photography Mobile Preview"
                className="carlypsphoto-iframe"
              />
            </div>
          </div>
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
          <a href="mailto:webwavebuilding@yahoo.com">webwavebuilding@yahoo.com</a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
