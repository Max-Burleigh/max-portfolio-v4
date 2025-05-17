"use client";

import React, { memo, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Define section keys type - needed for props
type SectionKey = "about" | "projects" | "contact"; // Or import from a shared types file if you have one

// --- NavItem Component ---
interface NavItemProps {
  section: string;
  activeSection: string;
  onClick: () => void;
}

const NavItem = memo(({ section, activeSection, onClick }: NavItemProps) => {
  const isActive = section === activeSection;

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

// --- Navigation Component ---
interface NavigationProps {
  activeSection: SectionKey;
  scrollToSection: (section: SectionKey) => void;
  sections: SectionKey[]; // Pass the sections array as a prop
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  scrollToSection,
  sections,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Hamburger icon (animated with improved transitions)
  const Hamburger = () => {
    // Interactive motion values for hover effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const hoverRadius = useTransform(mouseX, [-50, 50], [15, -15]);
    const hoverTilt = useTransform(mouseY, [-50, 50], [10, -10]);

    // Handle mouse movement for interactive hover
    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    return (
      <motion.button
        className="hamburger-btn md:hidden fixed top-5 right-5 z-[100] flex flex-col justify-center items-center w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-xl focus:outline-none overflow-hidden"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((v) => !v)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 25px rgba(79, 70, 229, 0.45)",
        }}
        whileTap={{ scale: 0.9 }}
        animate={
          menuOpen
            ? {
                rotate: 90,
                scale: 1.1,
              }
            : {
                rotate: 0,
                scale: 1,
              }
        }
        transition={{
          rotate: { type: "spring", stiffness: 200, damping: 15 },
          scale: { type: "spring", stiffness: 500, damping: 15 },
        }}
        style={{
          rotateX: hoverTilt,
          rotateY: hoverRadius,
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0"
          animate={{ opacity: menuOpen ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon lines - proper 'X' for close button */}
        <motion.span
          className="block w-6 bg-white rounded mb-1.5 z-10"
          animate={
            menuOpen
              ? { rotate: 45, y: 8, width: 20 }
              : { rotate: 0, y: 0, width: 24 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ height: "2px" }}
        />
        <motion.span
          className="block w-6 bg-white rounded z-10"
          animate={
            menuOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 24 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ height: "2px" }}
        />
        <motion.span
          className="block w-6 bg-white rounded mt-1.5 z-10"
          animate={
            menuOpen
              ? { rotate: -45, y: -8, width: 20 }
              : { rotate: 0, y: 0, width: 24 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ height: "2px" }}
        />
      </motion.button>
    );
  };

  // Container variants with staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Mobile menu overlay (fullscreen slide-in panel)
  const MobileMenu = () => (
    <motion.div
      className="fixed inset-0 z-[99] md:hidden overflow-hidden"
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: { visibility: "visible" },
        closed: {
          visibility: "hidden",
          transition: { delay: 0.3 }, // Delay visibility change until after animations
        },
      }}
    >
      {/* Backdrop with glass morphism */}
      <motion.div
        className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40"
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setMenuOpen(false)}
      >
        {/* Animated background effects */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full overflow-hidden opacity-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        >
          {/* Random floating particles for depth effect */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-cyan-300"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0.3,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{ filter: "blur(8px)" }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Menu panel - slide in from right */}
      <motion.div
        className="absolute inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl flex flex-col justify-center items-center shadow-2xl border-l border-white/10"
        variants={{
          open: { x: 0, opacity: 1 },
          closed: { x: "100%", opacity: 0.5 },
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.8,
          when: "beforeChildren",
          staggerChildren: 0.08,
        }}
      >
        <motion.div
          className="w-full flex flex-col items-center px-12 py-10"
          variants={containerVariants}
        >
          {sections.map((section, i) => (
            <motion.button
              key={section}
              className={`relative text-2xl font-bold mb-9 last:mb-0 text-white tracking-wide flex items-center ${
                section === activeSection ? "text-pink-300" : ""
              }`}
              onClick={() => {
                setMenuOpen(false);
                scrollToSection(section);
              }}
              custom={i}
              variants={{
                open: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.08,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  },
                }),
                closed: {
                  opacity: 0,
                  y: 50,
                },
              }}
              whileHover={{
                scale: 1.05,
                x: 15,
                color: "#00ffd5",
                transition: { type: "spring", stiffness: 400 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { type: "spring", stiffness: 800, damping: 20 },
              }}
              // Add subtle hover indicator with animation
              onHoverStart={() => {
                // Create subtle audio feedback if not active section
                if (section !== activeSection) {
                  const audio = new Audio();
                  audio.volume = 0.05; // Very quiet
                  audio.src =
                    "data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
                  audio.play().catch(() => {}); // Catch errors silently
                }
              }}
            >
              {/* Indicator comes FIRST now */}
              {section === activeSection && (
                <motion.div
                  // This div is the container for the dot and glow.
                  // It will be a flex item in the button.
                  // Add margin to its right for spacing from text.
                  // It needs to be relative for its children if they are absolute to it.
                  className="relative w-5 h-5 mr-4" // w-5 h-5 for the dot size. mr-4 for spacing.
                >
                  {/* Main active indicator span - now absolute to the w-5 h-5 parent div */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-pink-400"
                    layoutId="activeNavIndicator"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  />
                  {/* Decorative glow effect span - also absolute to the w-5 h-5 parent div */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-cyan-400"
                    layoutId="activeNavGlow"
                    initial={{ scale: 0.8, opacity: 0.2 }}
                    animate={{
                      scale: [1, 2, 1], // Glow animates scale
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    style={{
                      filter: "blur(8px)", // Glow blur
                      zIndex: -1, // Glow behind main dot
                    }}
                  />
                </motion.div>
              )}
              {/* Text comes AFTER the indicator div */}
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );

  // Add a subtle haptic feedback when menu opens/closes
  useEffect(() => {
    // Check if vibration API is supported
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (menuOpen) {
        // Subtle vibration when opening (15ms)
        navigator.vibrate(15);
      }
    }
  }, [menuOpen]);

  return (
    <>
      {/* Desktop Side Nav */}
      <nav className="side-nav hidden md:flex">
        {sections.map((section) => (
          <NavItem
            key={section}
            section={section}
            activeSection={activeSection}
            onClick={() => scrollToSection(section)}
          />
        ))}
      </nav>
      {/* Hamburger for mobile */}
      <Hamburger />
      {/* Mobile menu overlay with improved animation mode */}
      <AnimatePresence mode="sync">
        {menuOpen && <MobileMenu />}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
