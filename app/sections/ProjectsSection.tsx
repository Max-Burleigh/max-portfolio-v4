"use client";
import React, { forwardRef, useMemo, useRef, createRef, useCallback } from "react";
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

const ProjectsSection = forwardRef<HTMLDivElement>(function ProjectsSection(_, ref) {
  const entranceRef = useRef<HTMLDivElement>(null);
  const timelineEntranceRef = useRef<HTMLDivElement>(null);
  useEntranceStagger(entranceRef, { baseDelay: 60, step: 70 });
  useEntranceStagger(timelineEntranceRef, { baseDelay: 80, step: 70 });

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
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
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

  return (
    <section ref={ref} id="projects" className="section projects-section">
      <div className="projects-timeline-anchor">
        <aside
          ref={timelineEntranceRef}
          data-entrance="projects-timeline"
          className="projects-timeline-floating"
          aria-label="Project timeline"
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
        </aside>
      </div>

      <div className="projects-shell">
        <div ref={entranceRef} data-entrance="projects" className="projects-content-stack">
          <div className="projects-header">
            <h2 data-entrance-item>Projects</h2>
            <p data-entrance-item>Selected work spanning ecommerce, AI products, and community platforms.</p>
          </div>

          <div className="project-grid" data-entrance-item>
            {visibleProjects.map(({ id, children, ...props }) => (
              <div key={id} ref={projectRefs[id]} data-project-card>
                <ProjectCard {...props}>{children}</ProjectCard>
              </div>
            ))}
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

export default ProjectsSection;
