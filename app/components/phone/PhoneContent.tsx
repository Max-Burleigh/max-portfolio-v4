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
  const [loadIframe, setLoadIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // No more dynamic interaction handling required

  // No more event listeners needed since the message is always visible

  // Deferred loading: load iframe only after user interaction or when scrolled into view
  const handleLoadIframe = useCallback(() => {
    if (!loadIframe) {
      setLoadIframe(true);
    }
  }, [loadIframe]);

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

  useEffect(() => {
    if (type === "iframe" && loadIframe) {
      setIsVisible(true);
    }
  }, [type, loadIframe]);

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

            <div className="iframe-message static-message">
              <div className="message-content">
                <div className="message-icon">✨</div>
                <p>
                  For the full experience, visit{" "}
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    the website
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default case: render children
  return <div className={`${contentClass} ${className}`}>{children}</div>;
};

export default PhoneContent;
