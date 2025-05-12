import React from "react";
import "./PhoneMockup.css";

interface PhoneContentProps {
  children?: React.ReactNode;
  src?: string;
  type?: "iframe" | "image";
  className?: string;
  variant?: "vinscribe" | "carlypsphoto" | "fullleaf";
  alt?: string; // For image type
}

const PhoneContent: React.FC<PhoneContentProps> = ({
  children,
  src,
  type = "iframe",
  className = "",
  variant = "vinscribe",
  alt = "Phone content",
}) => {
  // Determine the content class based on variant
  const contentClass =
    variant === "vinscribe"
      ? "vinscribe-iframe"
      : variant === "carlypsphoto"
      ? "carlypsphoto-iframe"
      : variant === "fullleaf"
      ? "full-leaf-app-screenshot"
      : "";

  // Render appropriate content based on type
  if (type === "image" && src) {
    return (
      <img src={src} alt={alt} className={`${contentClass} ${className}`} />
    );
  }

  if (type === "iframe" && src) {
    return (
      <iframe
        src={src}
        className={`${contentClass} ${className}`}
        frameBorder="0"
        title={alt}
      />
    );
  }

  // Default case: render children
  return <div className={`${contentClass} ${className}`}>{children}</div>;
};

export default PhoneContent;
