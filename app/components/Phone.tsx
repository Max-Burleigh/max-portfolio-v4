"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Variant =
  | "default"
  | "vinscribe"
  | "carlypsphoto"
  | "fullleaf"
  | "fullleaf-tea"
  | "fullleaf-wholesale";

interface PhoneProps {
  className?: string;
  variant?: Variant;
  onMouseEnter?: () => void;
  onClick?: () => void;
  type?: "image" | "preview" | "custom";
  src?: string;
  alt?: string;
  blurDataURL?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

const Phone: React.FC<PhoneProps> = ({
  className = "",
  variant = "default",
  onMouseEnter,
  onClick,
  type = "image",
  src,
  alt = "Phone content",
  blurDataURL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg==",
  contentClassName = "",
  children,
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

  const [loadPreview, setLoadPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const contentVariantClass =
    variant === "vinscribe"
      ? "vinscribe-preview"
      : variant === "carlypsphoto"
      ? "carlypsphoto-preview"
      : variant === "fullleaf"
      ? "full-leaf-app-screenshot"
      : variant === "fullleaf-tea"
      ? "fullleaf-tea"
      : variant === "fullleaf-wholesale"
      ? "fullleaf-wholesale"
      : "";

  const [isVisible, setIsVisible] = useState(false);

  const handleLoadPreview = useCallback(() => {
    if (!loadPreview) setLoadPreview(true);
  }, [loadPreview]);

  useEffect(() => {
    if (type !== "preview" || loadPreview || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadPreview(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loadPreview, type]);

  return (
    <div
      className={`phone-mockup ${variantClass} ${className}`.trim()}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={interactiveStyle}
    >
      {type === "image" && src && (
        <div className={`phone-content-container${isVisible ? " fade-in" : ""}`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className={`${contentVariantClass} ${contentClassName}`.trim()}
            style={{
              objectFit:
                variant === "fullleaf-tea" || variant === "fullleaf-wholesale"
                  ? "contain"
                  : "cover",
              backgroundColor: variant === "fullleaf-wholesale" ? "white" : undefined,
              ...(variant === "fullleaf" || variant === "fullleaf-tea" || variant === "fullleaf-wholesale"
                ? {}
                : { borderRadius: "24px" }),
            }}
            onLoad={() => setIsVisible(true)}
          />
        </div>
      )}

      {type === "preview" && src && (
        <div
          ref={containerRef}
          className={`phone-content-container${isVisible ? " fade-in" : ""}`}
          onClick={handleLoadPreview}
        >
          {loadPreview && (
            <iframe
              src={src}
              className={`${contentVariantClass} ${contentClassName}`.trim()}
              frameBorder="0"
              title={alt}
              loading="lazy"
              onLoad={() => setIsVisible(true)}
            />
          )}
        </div>
      )}

      {type === "custom" && children}
    </div>
  );
};

export default Phone;

