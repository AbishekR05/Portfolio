import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/projects";
import "./ProjectsHorizontal.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsHorizontal() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Check accessibility/prefers-reduced-motion or mobile layout
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReduced) return;

    // Horizontally scroll the track based on vertical scroll scroll-length
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (track.scrollWidth - window.innerWidth),
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const x = -(track.scrollWidth - window.innerWidth) * self.progress;
        gsap.set(track, { x });
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="rail-section" id="projects">
      <div ref={trackRef} className="rail-track" id="railTrack">
        {/* Rail Heading */}
        <div className="rail-heading">
          <div className="eyebrow mono">SELECTED WORK</div>
          <h2 className="display">Three systems,<br />shipped and running.</h2>
        </div>

        {/* Project Cards (mapped dynamically) */}
        {projects.map((project, index) => (
          <div className="project-card" key={project.slug}>
            <span className="num mono">
              0{index + 1} / 0{projects.length}
            </span>
            <div className="thumb">
              <img
                src={project.image}
                alt={project.title}
                className="project-thumbnail-img"
              />
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tag-row">
              {project.stack.slice(0, 2).map((tech) => (
                <span className="tag mono" key={tech}>
                  {tech.toUpperCase()}
                </span>
              ))}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link mono"
            >
              VIEW PROJECT →
            </a>
          </div>
        ))}

        {/* End of index rail item */}
        <div className="rail-end mono">
          END OF INDEX ///<br />SCROLL DOWN TO CONTINUE ↓
        </div>
      </div>
    </section>
  );
}
