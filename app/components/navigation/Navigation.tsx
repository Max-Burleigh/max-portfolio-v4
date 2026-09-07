"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Define section keys type - needed for props
type SectionKey = "about" | "portfolio" | "services" | "contact"; // Or import from a shared types file

const mobileMenuItems: Array<{
  section: SectionKey;
  label: string;
}> = [
  { section: "about", label: "About" },
  { section: "services", label: "Services" },
  { section: "portfolio", label: "Portfolio" },
  { section: "contact", label: "Contact" },
];

// --- Hamburger Component (Extracted) ---
interface HamburgerProps {
  menuOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
}

const Hamburger: React.FC<HamburgerProps> = ({ menuOpen, setMenuOpen }) => {
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

  const handleToggle = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Prevent iOS/Safari ghost click from bubbling to overlay
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.button
      className="hamburger-btn fixed top-5 right-5 z-[102] flex flex-col justify-center items-center w-12 h-12 rounded-full focus:outline-none overflow-hidden"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onPointerUp={handleToggle}
      onClick={(e) => {
        // Safety: if click still fires after pointer, swallow it
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={{
        scale: 1.04,
        boxShadow:
          "0 18px 42px rgba(0, 0, 0, 0.26), 0 0 24px rgba(53, 243, 235, 0.16)",
      }}
      whileTap={{ scale: 0.94 }}
      animate={menuOpen ? { scale: 1.02 } : { scale: 1 }}
      transition={{ scale: { type: "spring", stiffness: 500, damping: 15 } }}
      style={{
        rotateX: hoverTilt,
        rotateY: hoverRadius,
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="hamburger-glass absolute inset-0"
        animate={{ opacity: menuOpen ? 1 : 0.88 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon lines - animates to 'X' and back to hamburger */}
      <motion.span
        className="hamburger-line block w-6 rounded mb-1.5 z-10"
        animate={
          menuOpen
            ? { rotate: 45, y: 8, width: 20 }
            : { rotate: 0, y: 0, width: 24 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ height: "2px" }}
      />
      <motion.span
        className="hamburger-line block w-6 rounded z-10"
        animate={
          menuOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 24 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ height: "2px" }}
      />
      <motion.span
        className="hamburger-line block w-6 rounded mt-1.5 z-10"
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
Hamburger.displayName = "Hamburger";

// --- MobileMenu Component (Extracted) ---
interface MobileMenuProps {
  sections: SectionKey[];
  activeSection: SectionKey;
  setMenuOpen: (isOpen: boolean) => void;
  scrollToSection: (section: SectionKey) => void;
  setActiveSection: (section: SectionKey) => void;
}

// Container variants - for staggering menu items
// Container variants - for staggering menu items (opacity handled by parent)
const containerVariants = {
  hidden: {
    transition: {
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.03,
      delayChildren: 0.14,
    },
  },
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  sections,
  activeSection,
  setMenuOpen,
  scrollToSection,
  setActiveSection,
}) => {
  const visibleMenuItems = mobileMenuItems.filter((item) =>
    sections.includes(item.section)
  );

  return (
    <>
      {/* Click-away backdrop (transparent) */}
      <button
        aria-label="Close menu backdrop"
        className="fixed inset-0 z-[100] bg-transparent"
        onClick={() => setMenuOpen(false)}
      />

      <motion.div
        className="mobile-menu-panel fixed top-16 right-4 z-[101]"
        style={{ willChange: "transform" }}
        initial={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(6px)" }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
      >
        <motion.nav
          aria-label="Mobile navigation"
          className="mobile-menu-card"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {visibleMenuItems.map(({ section, label }, index) => {
            const isActive = section === activeSection;
            const number = String(index + 1).padStart(2, "0");

            return (
              <motion.button
                key={section}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${number} ${label}`}
                className={`mobile-menu-item${isActive ? " is-active" : ""}`}
                onClick={() => {
                  setActiveSection(section);
                  setMenuOpen(false);
                  scrollToSection(section);
                }}
                variants={{
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring",
                      stiffness: 460,
                      damping: 28,
                    },
                  },
                  hidden: {
                    opacity: 0,
                    x: 14,
                    transition: {
                      type: "spring",
                      stiffness: 460,
                      damping: 28,
                    },
                  },
                }}
              >
                {isActive && (
                  <>
                    <motion.span
                      layoutId="mobile-nav-rail"
                      className="mobile-menu-active-rail"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 34,
                      }}
                    />
                  </>
                )}
                <span className="mobile-menu-index">{number}</span>
                <span className="mobile-menu-label">{label}</span>
              </motion.button>
            );
          })}
        </motion.nav>
      </motion.div>
    </>
  );
};

// --- Navigation Component (Refactored) ---
interface NavigationProps {
  activeSection: SectionKey;
  scrollToSection: (section: SectionKey) => void;
  sections: SectionKey[];
  menuOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
  setActiveSection: (section: SectionKey) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  scrollToSection,
  sections,
  menuOpen,
  setMenuOpen,
  setActiveSection,
}) => {
  const [menuKey, setMenuKey] = useState(0);

  const handleSetMenuOpen = (isOpen: boolean) => {
    if (isOpen) {
      setMenuKey((prev) => prev + 1);
    }
    setMenuOpen(isOpen);
  };
  // Add a subtle haptic feedback when menu opens/closes
  useEffect(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (menuOpen) {
        navigator.vibrate(15);
      }
    }
  }, [menuOpen]);

  return (
    <>
      {/* Hamburger navigation */}
      <Hamburger menuOpen={menuOpen} setMenuOpen={handleSetMenuOpen} />

      {/* Mobile menu overlay */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <MobileMenu
            key={menuKey}
            sections={sections}
            activeSection={activeSection}
            setMenuOpen={handleSetMenuOpen}
            scrollToSection={scrollToSection}
            setActiveSection={setActiveSection}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
