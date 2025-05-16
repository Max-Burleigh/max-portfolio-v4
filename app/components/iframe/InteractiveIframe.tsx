"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveIframeProps {
  src: string;
  title: string;
  className?: string;
}

const InteractiveIframe: React.FC<InteractiveIframeProps> = ({
  src,
  title,
  className,
}) => {
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Show message when user interacts with iframe
  const handleIframeInteraction = () => {
    if (!hasInteracted) {
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
    if (!iframe) return;

    // Use mouse and touch events to detect interaction
    iframe.addEventListener("mouseover", handleIframeInteraction);
    iframe.addEventListener("touchstart", handleIframeInteraction, { passive: true });
    
    // Show message automatically on mobile after a short delay
    const autoShowTimeout = setTimeout(() => {
      if (!hasInteracted && window.innerWidth < 768) {
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
  }, [hasInteracted]);

  return (
    <div className="interactive-iframe-container">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={className}
        loading="lazy"
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
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
};

export default InteractiveIframe;
