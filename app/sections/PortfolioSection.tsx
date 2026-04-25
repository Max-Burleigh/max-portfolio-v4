"use client";

import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { MdArrowForward, MdOpenInNew } from "react-icons/md";
import { projects } from "@/content/projects";
import { useEntranceStagger } from "@lib/hooks";

const PortfolioSection = forwardRef<HTMLDivElement>(function PortfolioSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  }, [WheelGesturesPlugin({ forceWheelAxis: "x" })]);
  useEntranceStagger(entranceRef, { baseDelay: 60, step: 55 });
  const visibleProjects = useMemo(() => projects.filter((project) => !project.hidden), []);

  const setShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      emblaRef(node);
    },
    [emblaRef]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const shell = shellRef.current;
    if (!shell) return;

    const syncShadowBounds = () => {
      const shellRect = shell.getBoundingClientRect();
      const firstCard = shell.querySelector<HTMLElement>(".portfolio-phone-card");
      const trackRect = firstCard?.getBoundingClientRect() ?? shell.getBoundingClientRect();
      const top = Math.max(0, trackRect.top - shellRect.top);
      const height = Math.max(0, Math.min(trackRect.height, shellRect.height - top));

      shell.style.setProperty("--portfolio-shadow-top", `${top.toFixed(2)}px`);
      shell.style.setProperty("--portfolio-shadow-height", `${height.toFixed(2)}px`);
    };

    const updateEdgeShadows = () => {
      const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
      const left = emblaApi.canScrollPrev() ? Math.min(progress * 6, 1) : 0;
      const right = emblaApi.canScrollNext() ? Math.min((1 - progress) * 6, 1) : 0;

      shell.style.setProperty("--portfolio-left-shadow", left.toFixed(3));
      shell.style.setProperty("--portfolio-right-shadow", right.toFixed(3));
      shell.classList.toggle("is-at-start", left < 0.02);
      shell.classList.toggle("is-at-end", right < 0.02);
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const onResize = () => {
      syncShadowBounds();
      updateEdgeShadows();
    };

    syncShadowBounds();
    updateEdgeShadows();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(shell);
    const firstCard = shell.querySelector<HTMLElement>(".portfolio-phone-card");
    if (firstCard) resizeObserver.observe(firstCard);
    shell.addEventListener("dragstart", onDragStart);
    window.addEventListener("resize", onResize);
    emblaApi.on("init", onResize);
    emblaApi.on("reInit", onResize);
    emblaApi.on("resize", onResize);
    emblaApi.on("scroll", updateEdgeShadows);
    emblaApi.on("select", updateEdgeShadows);

    return () => {
      shell.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("resize", onResize);
      emblaApi.off("init", onResize);
      emblaApi.off("reInit", onResize);
      emblaApi.off("resize", onResize);
      emblaApi.off("scroll", updateEdgeShadows);
      emblaApi.off("select", updateEdgeShadows);
      resizeObserver.disconnect();
    };
  }, [emblaApi]);

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

        <div ref={setShellRef} className="portfolio-deck-shell" data-entrance-item>
          <div className="portfolio-phone-deck">
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
                      <span key={item.label} className="portfolio-tech-pill">
                        <span className="portfolio-tech-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </span>
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
