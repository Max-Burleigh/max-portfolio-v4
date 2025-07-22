// File: app/components/phone/PhoneContent.tsx
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import "./PhoneMockup.css";

interface PhoneContentProps {
  children?: React.ReactNode;
  src?: string;
  type?: "iframe" | "image";
  className?: string;
  variant?:
    | "vinscribe"
    | "carlypsphoto"
    | "fullleaf"
    | "fullleaf-tea"
    | "fullleaf-wholesale";
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

  const contentClass =
    variant === "vinscribe"
      ? "vinscribe-iframe"
      : variant === "carlypsphoto"
      ? "carlypsphoto-iframe"
      : variant === "fullleaf"
      ? "full-leaf-app-screenshot"
      : variant === "fullleaf-tea"
      ? "fullleaf-tea"
      : variant === "fullleaf-wholesale"
      ? "fullleaf-wholesale"
      : "";

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

  const [isVisible, setIsVisible] = useState(false);

  if (type === "image" && src) {
    const imageStyle: React.CSSProperties = {
      objectFit:
        variant === "fullleaf-tea" || variant === "fullleaf-wholesale"
          ? "contain"
          : "cover",
      backgroundColor: variant === "fullleaf-wholesale" ? "white" : undefined,
    };

    // Let CSS handle border-radius for specific variants if classes are applied.
    // Apply a default radius only if no specific variant class is expected to handle it.
    if (
      variant !== "fullleaf-tea" &&
      variant !== "fullleaf-wholesale" &&
      variant !== "fullleaf" /* fullleaf (app) has its own CSS for radius */
    ) {
      imageStyle.borderRadius = "24px"; // Default for generic phone content
    }

    return (
      <div className={`phone-content-container${isVisible ? " fade-in" : ""}`}>
        <Image
          src={src}
          alt={alt}
          className={`${contentClass} ${className}`} // This applies .fullleaf-wholesale (or .fullleaf-tea etc.)
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          style={imageStyle}
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
              onLoad={() => setIsVisible(true)}
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
