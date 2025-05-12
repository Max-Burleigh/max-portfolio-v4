"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

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
  return (
    <nav className="side-nav">
      {sections.map((section) => (
        <NavItem
          key={section}
          section={section}
          activeSection={activeSection}
          onClick={() => scrollToSection(section)}
        />
      ))}
    </nav>
  );
};

export default Navigation;
