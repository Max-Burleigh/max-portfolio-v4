"use client";
import React, { forwardRef } from "react";
import ProjectCard from "@components/projects/ProjectCard";
import BasedChat from "@components/projects/BasedChat";
import { projects } from "@/content/projects";

const ProjectsSection = forwardRef<HTMLDivElement>(function ProjectsSection(_, ref) {
  return (
    <section ref={ref} id="projects" className="section projects-section">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map(({ id, children, ...props }) => (
          <ProjectCard key={id} {...props}>
            {children}
          </ProjectCard>
        ))}
        <BasedChat />
      </div>
    </section>
  );
});

export default ProjectsSection;
