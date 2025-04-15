"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { throttle } from "lodash";

// Define prop types for the AuroraBlob component
interface AuroraBlobProps {
  className?: string;
  style?: React.CSSProperties;
  initial?: any; // Using 'any' for Framer Motion props, but you could use more specific types from framer-motion
  animate?: any;
  transition?: any;
}

// Memoized Aurora Blob component for better performance
const AuroraBlob = memo(({ className, style, initial, animate, transition }: AuroraBlobProps) => (
  <motion.div
    className={`aurora-blob ${className}`}
    style={{ 
      ...style,
      willChange: "transform, opacity", // Hardware acceleration hint
    }}
    initial={initial}
    animate={animate}
    transition={transition}
  />
));
AuroraBlob.displayName = "AuroraBlob";

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
      <button
        className={isActive ? "active" : ""}
        onClick={onClick}
      >
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
  
  // Define section keys type for type safety
  type SectionKey = 'about' | 'projects' | 'contact';
  
  // Create properly typed section refs
  const sectionRefs: Record<SectionKey, React.RefObject<HTMLDivElement | null>> = {
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
  const scrollToSection = useCallback((section: SectionKey) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sectionRefs]);

  // Throttled scroll handler for better performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = throttle(() => {
      const scrollY = container.scrollTop;
      const viewportHeight = container.clientHeight;
      
      const offsets = Object.entries(sectionRefs).map(([key, ref]) => ({
        key: key as SectionKey,
        offset: ref.current ? ref.current.offsetTop : 0
      }));
      
      // Find which section is most visible in the viewport
      const current = offsets.reduce<SectionKey>((acc, curr) => {
        return (scrollY >= curr.offset - viewportHeight / 3) ? curr.key : acc;
      }, 'about');
      
      if (current !== activeSection) {
        setActiveSection(current);
      }
    }, 100); // Throttle to run at most every 100ms
    
    container.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100); // Small delay to ensure refs are populated
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [activeSection, sectionRefs]);

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
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
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
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        {...blobProps}
      />
      <AuroraBlob
        className="blob3"
        initial={{ opacity: 0.28, scale: 1.15, x: 60, y: 80 }} 
        animate={{
          opacity: [0.28, 0.38, 0.28],
          scale: [1.15, 1.22, 1.15],
          x: [60, 160, 60],
          y: [80, 140, 80], 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        {...blobProps}
        style={{
          background: 'radial-gradient(circle, rgba(20,35,80,0.50) 0%, rgba(20,35,80,0.0) 80%)',
          ...blobProps?.style
        }}
      />
      <AuroraBlob
        className="blob4"
        initial={{ opacity: 0.28, scale: 1.1, x: 200, y: 0 }} 
        animate={{
          opacity: [0.28, 0.38, 0.28],
          scale: [1.1, 1.18, 1.1],
          x: [200, 150, 200], 
          y: [0, 80, 0], 
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        {...blobProps}
        style={{
          background: 'radial-gradient(circle, rgba(40,70,120,0.45) 0%, rgba(40,70,120,0.0) 80%)',
          ...blobProps?.style
        }}
      />

      {/* Optimized cursor circle with useSpring for smoother motion */}
      <motion.div
        className="cursor-circle"
        style={{ 
          x: cursorX, 
          y: cursorY,
          willChange: "transform", // Hardware acceleration hint
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
      <section ref={sectionRefs.about} id="about" className="section about-section">
        <h1>Hey, I&apos;m Max Burleigh</h1>
        <p>web developer, project manager, solopreneur based in Medford, Oregon.</p>
      </section>

      {/* Projects Section */}
      <section ref={sectionRefs.projects} id="projects" className="section projects-section">
        <h2>Projects</h2>
        <div className="project-grid">
          <div className="project-card vinscribe-card">
            <div className="project-info">
              <a href="https://www.vinscribe.com" target="_blank" rel="noopener noreferrer"><strong>VINSCRIBE</strong></a>
              <p>AI-driven vehicle history reports and automotive tools.</p>
            </div>
            <img src="/vinscribe-phone.jpg" alt="VINSCRIBE app screenshot" className="vinscribe-image" />
          </div>
          <div className="project-card">
            <strong>Full Leaf App</strong>
            <p>A Flutter-based, WebView app for Full Leaf Tea Company.</p>
          </div>
          <div className="project-card">
            <strong>Quailmail</strong>
            <p>An autonomous AI email agent.</p>
          </div>
          <div className="project-card">
            <a href="https://fullleafteacompany.com" target="_blank" rel="noopener noreferrer">
              <strong>Full Leaf Tea Company</strong>
            </a>
            <p>FullLeafTeaCompany.com – E-commerce site for premium loose leaf tea.</p>
          </div>
          <div className="project-card">
            <a href="https://carlypsphoto.com" target="_blank" rel="noopener noreferrer">
              <strong>Carly Pearl-Sacks Photography</strong>
            </a>
            <p>Carlypsphoto.com – Portfolio site for a professional photographer.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRefs.contact} id="contact" className="section contact-section">
        <h2>Contact</h2>
        <p>Feel free to reach out if you have a project in mind or just want to chat!</p>
        <a href="mailto:webwavebuilding@yahoo.com">webwavebuilding@yahoo.com</a>
      </section>

      <style>{`
        /***********************************************
         * Aurora Gradient Background (More Detailed)
         ***********************************************/
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-family: 'Manrope', sans-serif;
          overflow: hidden;
          background: linear-gradient(120deg, #091236 0%, #1E215D 25%, #2F3F72 50%, #415A77 75%, #23252E 100%);
          background-size: 300% 300%;
          animation: aurora 30s ease-in-out infinite;
          transform: translateZ(0); /* Force GPU acceleration */
        }

        .portfolio-container {
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          position: relative;
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        /* Aurora Animated Blobs */
        .aurora-blob {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.5;
          width: 500px;
          height: 400px;
          mix-blend-mode: lighten;
          transform: translateZ(0); /* Force GPU acceleration */
        }
        .blob1 {
          background: radial-gradient(circle at 30% 40%, #00ffd5 0%, #0e1e4a 80%, transparent 100%);
          left: -200px;
          top: -100px;
        }
        .blob2 {
          background: radial-gradient(circle at 60% 30%, #ff5ce6 0%, #1e215d 80%, transparent 100%);
          right: -150px;
          top: 0px;
        }
        .blob3 {
          background: radial-gradient(circle at 50% 70%, #ffeb3b 0%, #2f3f72 80%, transparent 100%);
          left: 200px;
          bottom: -100px;
        }
        .blob4 {
          background: radial-gradient(circle at 70% 60%, #00aaff 0%, #415a77 80%, transparent 100%);
          right: 100px;
          top: -150px;
        }

        @keyframes aurora {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /***********************************************
         * Project Card Image Card (VINSCRIBE)
         ***********************************************/
        .project-card.vinscribe-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          /* Make the VINSCRIBE card larger */
          flex-basis: 100%;
          max-width: 100%;
          padding: 1.5rem;
        }
        .project-card.vinscribe-card .project-info {
          flex: 1 1 35%;
        }
        .project-card.vinscribe-card {
          min-height: 400px;
        }
        /* Removed .vinscribe-image-card as we're placing the image directly in the card */
        .vinscribe-image {
          flex: 1 1 60%;
          width: 310px;
          height: 400px;
          object-fit: contain;
          border-radius: 14px;
          background: #191c23;
          box-shadow: 0 6px 24px 0 rgba(0,0,0,0.14);
          border: 2px solid #23252e;
          padding: 0.5rem;
        }
        
        /* Update the project grid to handle the larger card */
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
          width: 100%;
        }
        .project-card {
          min-width: 0;
          padding: 1.5rem 1.5rem;
          font-size: 1.1rem;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 900px) {
          .project-grid {
            grid-template-columns: repeat(2, minmax(360px, 1fr));
            gap: 2.5rem;
          }
          .project-card {
            min-width: 340px;
            padding: 2.2rem 2rem;
            font-size: 1.18rem;
          }
          .vinscribe-image-card {
            width: 160px;
            height: 160px;
            flex: 0 0 160px;
          }
        }

        /***********************************************
         * Cursor Circle
         ***********************************************/
        .cursor-circle {
          position: fixed;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.4), rgba(255,255,255,0));
          filter: blur(30px);
          pointer-events: none;
          z-index: 0; /* Place glow behind cards but above background */
          transform: translateZ(0); /* Force GPU acceleration */
        }

        /***********************************************
         * Side Navigation + Buttons
         ***********************************************/
        .side-nav {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          position: relative;
          margin-bottom: 1rem;
        }

        .side-nav button {
          background: none;
          color: #ffffff;
          cursor: pointer;
          border: none;
          font-size: 1.1rem;
          text-align: left;
          opacity: 0.7;
          transition: opacity 0.3s, color 0.3s, transform 0.3s;
        }

        .side-nav button.active {
          opacity: 1;
          color: #00ffd5;
          font-weight: 600;
        }

        .side-nav button:hover,
        .side-nav button:focus {
          opacity: 1;
          transform: translateX(3px);
        }

        /* Elastic Underline for each nav item */
        .elastic-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background-color: #00ffd5;
          transform: scaleX(0);
          transform-origin: left center;
          will-change: transform; /* Force GPU acceleration */
        }

        /***********************************************
         * Main Sections
         ***********************************************/
        .section {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          z-index: 2;
          padding-left: 12vw;
          padding-right: 2vw;
        }

        h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .side-nav, .side-nav button, .section, p, a, .project-card {
          font-family: 'Manrope', sans-serif;
        }

        p {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        a {
          color: #00ffd5;
          text-decoration: none;
          font-weight: 600;
        }

        /***********************************************
         * Projects Grid
         ***********************************************/
        .project-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .project-card {
          flex: 1 1 calc(33% - 1rem);
          min-width: 250px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.25rem;
          text-align: left;
          transition: transform 0.3s, background 0.3s;
          will-change: transform, background; /* Force GPU acceleration */
        }

        .project-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.06);
        }

        .project-card strong {
          font-size: 1.2rem;
          color: #00ffd5;
          display: block;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;