"use client";

import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { MdArrowForward, MdOpenInNew } from "react-icons/md";
import { projects, type ProjectEntry } from "@/content/projects";
import { useEntranceStagger } from "@lib/hooks";

const FALLBACK_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg==";

type PortfolioProjectCardProps = {
  project: ProjectEntry;
  index: number;
};

const PortfolioProjectCard = React.memo(function PortfolioProjectCard({
  project,
  index,
}: PortfolioProjectCardProps) {
  return (
    <article className="portfolio-phone-card">
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
            sizes="(max-width: 768px) 190px, (max-width: 1279px) 210px, 245px"
            placeholder="blur"
            blurDataURL={project.imageBlurDataURL || FALLBACK_BLUR_DATA_URL}
          />
        )}
      </div>

      {project.websiteUrl && (
        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="portfolio-tile-link">
          Visit <MdOpenInNew aria-hidden="true" />
        </a>
      )}
    </article>
  );
});

const PortfolioSection = React.memo(forwardRef<HTMLDivElement>(function PortfolioSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const lastShadowBoundsRef = useRef({ top: "", height: "" });
  const lastEdgeStateRef = useRef({ left: false, right: false });
  const emblaOptions = useMemo(
    () => ({
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      dragFree: true,
    }),
    []
  );
  const wheelGestures = useMemo(() => WheelGesturesPlugin({ forceWheelAxis: "x" }), []);
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [wheelGestures]);
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
      const nextTop = `${top.toFixed(2)}px`;
      const nextHeight = `${height.toFixed(2)}px`;

      if (lastShadowBoundsRef.current.top !== nextTop) {
        shell.style.setProperty("--portfolio-shadow-top", nextTop);
        lastShadowBoundsRef.current.top = nextTop;
      }

      if (lastShadowBoundsRef.current.height !== nextHeight) {
        shell.style.setProperty("--portfolio-shadow-height", nextHeight);
        lastShadowBoundsRef.current.height = nextHeight;
      }
    };

    const updateEdgeShadows = () => {
      const left = emblaApi.canScrollPrev();
      const right = emblaApi.canScrollNext();
      const previous = lastEdgeStateRef.current;
      if (previous.left === left && previous.right === right) return;

      shell.style.setProperty("--portfolio-left-shadow", left ? "1" : "0");
      shell.style.setProperty("--portfolio-right-shadow", right ? "1" : "0");
      shell.classList.toggle("is-at-start", !left);
      shell.classList.toggle("is-at-end", !right);
      lastEdgeStateRef.current = { left, right };
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
            <h2>Projects that shipped.</h2>
          </div>
          <p>
            Phone-sized snapshots of ecommerce, AI products, mobile apps, and local business sites.
            Scroll the deck sideways without leaving the frame.
          </p>
        </div>

        <div ref={setShellRef} className="portfolio-deck-shell" data-entrance-item>
          <div className="portfolio-phone-deck">
            {visibleProjects.map((project, index) => (
              <PortfolioProjectCard key={project.id} project={project} index={index} />
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
}));

PortfolioSection.displayName = "PortfolioSection";

export default PortfolioSection;
