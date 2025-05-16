"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define section keys type - needed for props
type SectionKey = "about" | "projects" | "contact"; // Or import from a shared types file if you have one

// --- NavItem Component --- (Moved from app/page.tsx)
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

  // Hamburger icon (animated)
  const Hamburger = () => (
    <button
      className="hamburger-btn md:hidden fixed top-4 right-4 z-[100] flex flex-col justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg focus:outline-none"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      onClick={() => setMenuOpen((v) => !v)}
    >
      <motion.span
        className="block w-5 h-0.5 bg-white rounded mb-1"
        animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <motion.span
        className="block w-5 h-0.5 bg-white rounded"
        animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block w-5 h-0.5 bg-white rounded mt-1"
        animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );

  // Container variants for fluid animation - with minimal delay
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  // Item variants for rapid spring animation
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 850,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 850,
        damping: 20,
      },
    },
  };

  // Mobile menu overlay (floating panel)
  const MobileMenu = () => (
    <motion.div
      className="fixed inset-0 z-[99] md:hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Menu panel */}
      <motion.div
        className="relative bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-2xl shadow-2xl px-12 py-10 flex flex-col items-center w-[85%] max-w-xs border border-white/10"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 400,
          mass: 0.6,
          duration: 0.2,
        }}
      >
        <motion.div
          className="w-full flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {sections.map((section) => (
            <motion.button
              key={section}
              className={`text-2xl font-bold mb-6 last:mb-0 text-white drop-shadow-lg tracking-wide ${
                section === activeSection ? "text-pink-300 scale-110" : ""
              }`}
              onClick={() => {
                setMenuOpen(false);
                scrollToSection(section);
              }}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, duration: 0.1 },
              }}
              whileTap={{
                scale: 0.95,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                  duration: 0.1,
                },
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );

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
      {/* Mobile menu overlay */}
      <AnimatePresence mode="wait">
        {menuOpen && <MobileMenu />}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
