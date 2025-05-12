import React from "react";
import "./PhoneMockup.css";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fullleaf";
  onMouseEnter?: () => void;
  onClick?: () => void;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  className = "",
  variant = "default",
  onMouseEnter,
  onClick,
}) => {
  const interactiveStyle = onClick || onMouseEnter ? { cursor: "pointer" } : {};

  return (
    <div
      className={`phone-mockup ${
        variant === "fullleaf" ? "fullleaf-mockup" : ""
      } ${className}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={interactiveStyle}
    >
      {children}
    </div>
  );
};

export default PhoneMockup;
