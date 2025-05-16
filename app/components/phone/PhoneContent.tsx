"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Determine the content class based on variant
  const contentClass =
    variant === "vinscribe"
      ? "vinscribe-iframe"
      : variant === "carlypsphoto"
      ? "carlypsphoto-iframe"
      : variant === "fullleaf"
      ? "full-leaf-app-screenshot"
      : "";

  // Show message when user interacts with iframe
  const handleIframeInteraction = () => {
    if (!hasInteracted && type === "iframe" && src) {
      setIsMessageVisible(true);
      setHasInteracted(true);

      // Hide message after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setIsMessageVisible(false);
      }, 5000);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || type !== "iframe") return;

    // Use mouse and touch events to detect interaction
    iframe.addEventListener("mouseover", handleIframeInteraction);
    iframe.addEventListener("touchstart", handleIframeInteraction, { passive: true });
    
    // Show message automatically on mobile after a short delay
    const autoShowTimeout = setTimeout(() => {
      if (!hasInteracted && window.innerWidth < 768 && type === "iframe" && src) {
        handleIframeInteraction();
      }
    }, 1500);

    return () => {
      iframe.removeEventListener("mouseover", handleIframeInteraction);
      iframe.removeEventListener("touchstart", handleIframeInteraction);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(autoShowTimeout);
    };
  }, [hasInteracted, type, src]);

  // Render appropriate content based on type
  if (type === "image" && src) {
    return (
      <img src={src} alt={alt} className={`${contentClass} ${className}`} />
    );
  }

  if (type === "iframe" && src) {
    return (
      <div className="phone-content-container">
        <iframe
          ref={iframeRef}
          src={src}
          className={`${contentClass} ${className}`}
          frameBorder="0"
          title={alt}
        />

        <AnimatePresence>
          {isMessageVisible && (
            <motion.div
              className="iframe-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <div className="message-icon">✨</div>
                <p>
                  For the full experience, visit{" "}
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    the website
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default case: render children
  return <div className={`${contentClass} ${className}`}>{children}</div>;
};

export default PhoneContent;
