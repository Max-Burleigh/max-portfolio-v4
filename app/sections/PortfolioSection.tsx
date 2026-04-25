"use client";

import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { MdArrowForward, MdOpenInNew } from "react-icons/md";
import { projects } from "@/content/projects";
import { useEntranceStagger } from "@lib/hooks";

const PortfolioSection = forwardRef<HTMLDivElement>(function PortfolioSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 60, step: 55 });
  const visibleProjects = useMemo(() => projects.filter((project) => !project.hidden), []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    const DRAG_THRESHOLD = 6;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = deck.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        deck.classList.add("is-dragging");
      }
      if (moved) {
        e.preventDefault();
        deck.scrollLeft = startScroll - dx;
      }
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      deck.classList.remove("is-dragging");
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    deck.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    deck.addEventListener("click", onClickCapture, true);
    deck.addEventListener("dragstart", onDragStart);

    return () => {
      deck.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      deck.removeEventListener("click", onClickCapture, true);
      deck.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return (
    <section ref={ref} id="portfolio" className="section portfolio-section">
      <div ref={entranceRef} className="portfolio-cockpit" data-entrance="portfolio-cockpit">
        <div className="cockpit-header" data-entrance-item>
          <div>
            <p className="hero-eyebrow">Portfolio</p>
            <h2>{visibleProjects.length} project field notes.</h2>
          </div>
          <p>
            Phone-sized snapshots of ecommerce, AI products, mobile apps, and local business sites.
            Scroll the deck sideways without leaving the frame.
          </p>
        </div>

        <div className="portfolio-phone-deck" data-entrance-item>
          {visibleProjects.map((project, index) => (
            <article key={project.id} className="portfolio-phone-card">
              <div className="portfolio-phone-copy">
                <span className="portfolio-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{project.title}</h3>
                <div className="portfolio-description">
                  {project.id === "fullleaf-app" ? (
                    <>
                      <p>A Flutter-based, WebView app for Full Leaf Tea Company.</p>
                      <div className="portfolio-store-links">
                        <a href="https://apps.apple.com/us/app/full-leaf-tea-co/id6451437741" target="_blank" rel="noopener noreferrer">App Store</a>
                        <span aria-hidden="true">/</span>
                        <a href="https://play.google.com/store/apps/details?id=fullleafteacompany.android.app&hl=en_US&pli=1" target="_blank" rel="noopener noreferrer">Play Store</a>
                      </div>
                    </>
                  ) : typeof project.description === "string" ? <p>{project.description}</p> : project.description}
                </div>
                <div className="portfolio-tech-strip" aria-label={`${project.title} tech stack`}>
                  {project.techStack?.slice(0, 4).map((item) => (
                    <span key={item.label}>{item.label}</span>
                  ))}
                </div>
              </div>

              <div className="portfolio-phone-preview" aria-label={`${project.title} preview`}>
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt || `Screenshot of ${project.title}`}
                    width={600}
                    height={1200}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={project.imageBlurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg=="}
                  />
                )}
              </div>

              {project.websiteUrl && (
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="portfolio-tile-link">
                  Visit <MdOpenInNew aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="portfolio-hint" data-entrance-item>
          <span>Drag or scroll horizontally</span>
          <MdArrowForward aria-hidden="true" />
        </div>
      </div>
    </section>
  );
});

export default PortfolioSection;
