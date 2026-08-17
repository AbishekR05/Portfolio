import React, { useState } from "react";
import "./Tools.css";

export default function Tools() {
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    {
      id: "systems",
      title: "Systems I Work With",
      items: ["React.js", "Node.js", "Express.js", "Flask", "Streamlit", "Electron", "MongoDB", "MySQL"]
    },
    {
      id: "focus",
      title: "Current Focus",
      items: ["AI/ML", "TensorFlow", "Scikit-learn", "PyTorch", "Deep Learning", "Computer Vision", "NLP"]
    },
    {
      id: "tools",
      title: "Tools I Use Daily",
      items: ["Python", "Java", "JavaScript", "C", "Git", "GitHub", "Figma", "VS Code"]
    }
  ];

  return (
    <section id="tools" className="tools-section dark-theme">
      <div className="tools-container container">
        <div className="eyebrow mono">STACK</div>
        <h2 className="display">Tech Stack &amp; Focus</h2>
        
        <div className="interactive-rows">
          {sections.map((sec) => (
            <div 
              key={sec.id}
              className={`interactive-row ${hoveredSection === sec.id ? "is-hovered" : ""}`}
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="row-title display">
                {sec.title}
              </div>
              
              <div className={`marquee-band ${hoveredSection === sec.id ? "active" : ""}`}>
                <div className="marquee-track">
                  {/* Repeat item lists for seamless infinite loop */}
                  {Array(4).fill(sec.items).flat().map((item, idx) => (
                    <span key={idx}>{item.toUpperCase()} ✦&nbsp;</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
