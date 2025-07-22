import React from "react";
import "./PhoneMockup.css";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fullleaf" | "fullleaf-tea" | "fullleaf-wholesale";
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

  const variantClass =
    variant === "fullleaf"
      ? "fullleaf-mockup"
      : variant === "fullleaf-tea"
      ? "fullleaf-tea-mockup"
      : variant === "fullleaf-wholesale"
      ? "fullleaf-wholesale-mockup"
      : "";

  return (
    <div
      className={`phone-mockup ${variantClass} ${className}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={interactiveStyle}
    >
      {children}
    </div>
  );
};

export default PhoneMockup;
