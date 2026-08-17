import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/projects";
import "./ProjectsHorizontal.css";

export default function ProjectsHorizontal() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressLineRef = useRef(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(1);

  useGSAP(() => {
    // Check prefers-reduced-motion or mobile layout
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReduced) return;

    const track = trackRef.current;
    const scrollLength = track.scrollWidth - window.innerWidth;

    // Translate vertical scroll to horizontal scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${scrollLength}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update active index based on scroll progress
          const index = Math.min(
            projects.length,
            Math.ceil(self.progress * projects.length) || 1
          );
          setActiveProjectIndex(index);

          // Update progress line width
          if (progressLineRef.current) {
            gsap.set(progressLineRef.current, { width: `${self.progress * 100}%` });
          }
        }
      }
    });

    tl.to(track, {
      x: -scrollLength,
      ease: "none",
    });

    // Add parallax effect on project card images
    const images = gsap.utils.toArray(".project-img");
    images.forEach((img) => {
      gsap.fromTo(
        img,
        { xPercent: -10 },
        {
          xPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            containerAnimation: tl, // synced with the main timeline
            start: "left right",
            end: "right left",
            scrub: true,
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="section-title-wrapper container">
        <h3 className="eyebrow-text">SELECTED WORK</h3>
      </div>
      
      <div className="projects-track" ref={trackRef}>
        {projects.map((project, i) => (
          <div className="project-card" key={project.slug}>
            <div className="project-card-inner">
              
              {/* Left Column - Details */}
              <div className="project-details">
                <div className="project-number display-text">0{i + 1}</div>
                <h2 className="project-title display-text">{project.title}</h2>
                <p className="project-desc body-text">{project.description}</p>
                
                <div className="project-stack">
                  {project.stack.map((tech) => (
                    <span className="tech-badge eyebrow-text" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link eyebrow-text"
                >
                  VIEW CASE STUDY →
                </a>
              </div>

              {/* Right Column - Image */}
              <div className="project-visual">
                <div className="project-img-container">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-img" 
                  />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Progress HUD indicator (desktop only) */}
      <div className="projects-hud">
        <span className="eyebrow-text">
          0{activeProjectIndex} / 0{projects.length}
        </span>
        <div className="progress-bar-track">
          <div ref={progressLineRef} className="progress-bar-fill"></div>
        </div>
      </div>
    </section>
  );
}
