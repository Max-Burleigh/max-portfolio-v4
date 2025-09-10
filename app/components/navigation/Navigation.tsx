"use client";

import React, { memo, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Define section keys type - needed for props
type SectionKey = "about" | "projects" | "contact"; // Or import from a shared types file

// --- NavItem Component (restored original feel) ---
interface NavItemProps {
  section: SectionKey;
  activeSection: SectionKey;
  onClick: () => void;
}

const NavItem = memo(({ section, activeSection, onClick }: NavItemProps) => {
  const isActive = section === activeSection;

  const underlineVariants = {
    inactive: { scaleX: 0 },
    active: {
      scaleX: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 },
    },
  } as const;

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

// Desktop Nav removed – mobile-only menu

// --- SideNav Component (Desktop) ---
interface SideNavProps {
  sections: SectionKey[];
  activeSection: SectionKey;
  scrollToSection: (section: SectionKey) => void;
}

const SideNav: React.FC<SideNavProps> = ({
  sections,
  activeSection,
  scrollToSection,
}) => (
  <nav className="side-nav">
    {sections.map((section) => (
      <NavItem
        key={section}
        section={section}
        activeSection={activeSection}
        onClick={() => {
          scrollToSection(section);
        }}
      />
    ))}
  </nav>
);

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
      className="hamburger-btn md:hidden fixed top-5 right-5 z-[102] flex flex-col justify-center items-center w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-xl focus:outline-none overflow-hidden"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
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
        scale: 1.1,
        boxShadow: "0 0 25px rgba(79, 70, 229, 0.45)",
      }}
      whileTap={{ scale: 0.9 }}
      animate={menuOpen ? { scale: 1.1 } : { scale: 1 }}
      transition={{ scale: { type: "spring", stiffness: 500, damping: 15 } }}
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

      {/* Icon lines - animates to 'X' and back to hamburger */}
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
const containerVariants = {
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
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
}) => (
  <motion.div
    className="mobile-menu-panel fixed top-0 right-0 h-full w-[280px] bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl flex flex-col justify-center items-center shadow-2xl border-l border-white/10 z-[101] md:hidden"
    initial={{ x: "100%", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: "100%", opacity: 0 }}
    transition={{
      type: "spring",
      damping: 26,
      stiffness: 360,
    }}
  >
    <motion.div
      className="w-full flex flex-col items-center px-12 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {sections.map((section) => (
        <motion.button
          key={section}
          className={`relative pl-6 text-2xl font-bold mb-9 last:mb-0 text-white tracking-wide flex items-center w-full justify-start hover:text-[#00ffd5] ${
            section === activeSection ? "text-pink-300" : ""
          }`}
          onClick={() => {
            // Immediate UI feedback
            setActiveSection(section as SectionKey);
            setMenuOpen(false);
            scrollToSection(section);
          }}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 420, damping: 22 },
            },
            hidden: {
              opacity: 0,
              y: 16,
              transition: { type: "spring", stiffness: 420, damping: 22 },
            },
          }}
          onHoverStart={() => {
            if (section !== activeSection) {
              const audio = new Audio(
                "data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
              );
              audio.volume = 0.05;
              audio.play().catch(() => {});
            }
          }}
        >
          {section === activeSection && (
            <motion.span
              layoutId="mobile-nav-rail"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-gradient-to-b from-pink-300 via-purple-400 to-blue-400 shadow-[0_0_8px_rgba(79,70,229,0.45)]"
              style={{ willChange: "transform" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
        </motion.button>
      ))}
    </motion.div>
  </motion.div>
);

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
      {/* Desktop side navigation */}
      <SideNav
        sections={sections}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* Hamburger for mobile */}
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
