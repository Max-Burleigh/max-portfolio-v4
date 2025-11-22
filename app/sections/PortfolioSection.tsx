"use client";
import React, { forwardRef, useMemo, useRef, createRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import ProjectCard from "@components/projects/ProjectCard";
import BasedChat from "@components/projects/BasedChat";
import Colorbookorama from "@components/projects/Colorbookorama";
import { projects } from "@/content/projects";
import { useEntranceStagger, useActiveSection } from "@lib/hooks";

const CUSTOM_PROJECT_IDS = ["basedchat", "colorbookorama"] as const;
const CUSTOM_LABELS: Record<(typeof CUSTOM_PROJECT_IDS)[number], string> = {
  basedchat: "Based Chat",
  colorbookorama: "Colorbookorama",
};

const PortfolioSection = forwardRef<HTMLDivElement>(function PortfolioSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  const timelineEntranceRef = useRef<HTMLElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 60, step: 70 });
  useEntranceStagger(timelineEntranceRef, { baseDelay: 80, step: 70 });

  // Scroll-driven expansion for the timeline
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ["start 90%", "start 15%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const smoothScale = useSpring(scale, { damping: 20, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 20, stiffness: 100 });

  const visibleProjects = useMemo(() => projects.filter((project) => !project.hidden), []);
  const projectMap = useMemo(() => {
    const map = new Map<string, (typeof projects)[number]>();
    visibleProjects.forEach((project) => map.set(project.id, project));
    return map;
  }, [visibleProjects]);

  const timelineIds = useMemo(
    () => [...visibleProjects.map((project) => project.id), ...CUSTOM_PROJECT_IDS],
    [visibleProjects]
  );

  const projectRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    timelineIds.forEach((id) => {
      refs[id] = createRef<HTMLDivElement>();
    });
    return refs;
  }, [timelineIds]);

  const timelineEntries = useMemo(
    () =>
      timelineIds.map((id) => {
        const project = projectMap.get(id);
        return {
          id,
          title: CUSTOM_LABELS[id as keyof typeof CUSTOM_LABELS] ?? project?.title ?? "Project",
        };
      }),
    [timelineIds, projectMap]
  );

  const { activeSection: activeProject } = useActiveSection(projectRefs);
  const scrollToProject = useCallback(
    (id: string) => {
      projectRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [projectRefs]
  );

  type TimelineStyle = React.CSSProperties & {
    "--timeline-scale": MotionValue<number>;
    "--timeline-opacity": MotionValue<number>;
  };

  const timelineStyle: TimelineStyle = {
    "--timeline-scale": smoothScale,
    "--timeline-opacity": smoothOpacity,
  };

  return (
    <section ref={ref} id="portfolio" className="section portfolio-section">
      <div className="portfolio-timeline-anchor">
        <motion.aside
          ref={timelineEntranceRef}
          data-entrance="portfolio-timeline"
          className="portfolio-timeline-floating"
          aria-label="Project timeline"
          style={timelineStyle}
        >
          <div className="timeline-heading" data-entrance-item>
            <p className="eyebrow">TABLE OF CONTENTS</p>
          </div>
          <ul className="timeline-rail">
            {timelineEntries.map((entry) => (
              <li
                key={entry.id}
                className={`timeline-label ${activeProject === entry.id ? "is-active" : ""}`}
                data-entrance-item
                aria-current={activeProject === entry.id ? "true" : undefined}
              >
                <button
                  type="button"
                  onClick={() => scrollToProject(entry.id)}
                  aria-label={`Scroll to ${entry.title}`}
                >
                  <span>{entry.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>

      <div className="portfolio-shell">
        <div ref={entranceRef} data-entrance="portfolio" className="portfolio-content-stack">
          <div className="portfolio-header">
            <h2 data-entrance-item>Portfolio</h2>
            <p data-entrance-item className="portfolio-subcopy">
              Selected work spanning ecommerce, AI products, and community platforms.
            </p>
          </div>

          <div className="project-grid" data-entrance-item>
            {visibleProjects.map(({ id, children, reverseLayout, ...props }, index) => {
              const shouldReverse =
                typeof reverseLayout === "boolean" ? reverseLayout : index % 2 === 1;
              return (
                <div key={id} ref={projectRefs[id]} data-project-card>
                  <ProjectCard {...props} reverseLayout={shouldReverse}>
                    {children}
                  </ProjectCard>
                </div>
              );
            })}
            <div ref={projectRefs["basedchat"]} data-project-card>
              <BasedChat />
            </div>
            <div ref={projectRefs["colorbookorama"]} data-project-card>
              <Colorbookorama />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default PortfolioSection;
