"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "./PhoneMockup.css";

interface PhoneContentProps {
  children?: React.ReactNode;
  src?: string;
  type?: "iframe" | "image";
  className?: string;
  variant?: "vinscribe" | "carlypsphoto" | "fullleaf" | "fullleaf-tea";
  alt?: string; // For image type
  blurDataURL?: string; // Custom blur placeholder for image loading
}

const PhoneContent: React.FC<PhoneContentProps> = ({
  children,
  src,
  type = "iframe",
  className = "",
  variant = "vinscribe",
  alt = "Phone content",
  blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg==",
}) => {
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Determine the content class based on variant
  const contentClass =
    variant === "vinscribe"
      ? "vinscribe-iframe"
      : variant === "carlypsphoto"
      ? "carlypsphoto-iframe"
      : variant === "fullleaf"
      ? "full-leaf-app-screenshot"
      : variant === "fullleaf-tea"
      ? "fullleaf-tea"
      : "";

  // Show message when user interacts with iframe
  const handleIframeInteraction = useCallback(() => {
    if (!hasInteracted && type === "iframe" && src) {
      setIsMessageVisible(true);
      setHasInteracted(true);

      // Hide message after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setIsMessageVisible(false);
      }, 5000);
    }
  }, [hasInteracted, type, src]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || type !== "iframe") return;

    // Use mouse and touch events to detect interaction
    iframe.addEventListener("mouseover", handleIframeInteraction);
    iframe.addEventListener("touchstart", handleIframeInteraction, {
      passive: true,
    });

    // Show message automatically on mobile after a short delay
    const autoShowTimeout = setTimeout(() => {
      if (
        !hasInteracted &&
        window.innerWidth < 768 &&
        type === "iframe" &&
        src
      ) {
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
  }, [hasInteracted, type, src, handleIframeInteraction]);

  // Deferred loading: load iframe only after user interaction or when scrolled into view
  const [loadIframe, setLoadIframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleLoadIframe = useCallback(() => {
    if (!loadIframe) {
      setLoadIframe(true);
      handleIframeInteraction();
    }
  }, [loadIframe, handleIframeInteraction]);

  useEffect(() => {
    if (type !== "iframe" || loadIframe || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loadIframe, type]);

  // Render appropriate content based on type
  const [isVisible, setIsVisible] = useState(false);

  if (type === "image" && src) {
    return (
      <div className={`phone-content-container${isVisible ? " fade-in" : ""}`}>
        <Image
          src={src}
          alt={alt}
          className={`${contentClass} ${className}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          style={{
            objectFit: variant === "fullleaf-tea" ? "contain" : "cover",
            borderRadius: variant === "fullleaf-tea" ? "20px" : "24px",
          }}
          onLoad={() => setIsVisible(true)}
        />
      </div>
    );
  }

  useEffect(() => {
    if (type === "iframe" && loadIframe) {
      setIsVisible(true);
    }
  }, [type, loadIframe]);

  if (type === "iframe" && src) {
    return (
      <div
        ref={containerRef}
        className={`phone-content-container${isVisible ? " fade-in" : ""}`}
        onClick={handleLoadIframe}
      >
        {loadIframe && (
          <>
            <iframe
              ref={iframeRef}
              src={src}
              className={`${contentClass} ${className}`}
              frameBorder="0"
              title={alt}
              loading="lazy"
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
          </>
        )}
      </div>
    );
  }

  // Default case: render children
  return <div className={`${contentClass} ${className}`}>{children}</div>;
};

export default PhoneContent;
