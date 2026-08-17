import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./TakeoverStats.css";

export default function TakeoverStats() {
  const containerRef = useRef(null);
  const statsRef = useRef([]);

  useGSAP(() => {
    // Staggered reveal of stats when the section is pinned or scrolled in
    const statsElements = statsRef.current.filter(Boolean);
    
    gsap.fromTo(
      statsElements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.25,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center+=100", // triggers early in the scroll
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: containerRef });

  const statData = [
    { value: "5+ PROJECTS SHIPPED", label: "Full-stack Systems" },
    { value: "ACTIVE PRODUCTS", label: "Live in Production" },
    { value: "INTERNATIONAL CLIENTS", label: "Global Reach" },
  ];

  return (
    <section ref={containerRef} id="stats" className="stats-section dark-theme">
      <div className="stats-container">
        {statData.map((stat, index) => (
          <div
            key={index}
            ref={(el) => (statsRef.current[index] = el)}
            className="stat-item"
          >
            <h2 className="stat-value display-text">{stat.value}</h2>
            <div className="stat-divider"></div>
            <p className="stat-label eyebrow-text">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
