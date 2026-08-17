import React, { useState } from "react";
import { 
  SiReact, SiNodedotjs, SiExpress, SiFlask, SiStreamlit, SiElectron, SiMongodb, SiMysql,
  SiTensorflow, SiScikitlearn, SiPytorch, SiPython, SiGit, SiGithub, SiFigma,
  SiJavascript, SiC
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { DiVisualstudio } from "react-icons/di";
import "./Tools.css";

export default function Tools() {
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    {
      id: "systems",
      title: "Systems I Work With",
      items: [
        { label: "React.js", icon: SiReact },
        { label: "Node.js", icon: SiNodedotjs },
        { label: "Express.js", icon: SiExpress },
        { label: "Flask", icon: SiFlask },
        { label: "Streamlit", icon: SiStreamlit },
        { label: "Electron", icon: SiElectron },
        { label: "MongoDB", icon: SiMongodb },
        { label: "MySQL", icon: SiMysql }
      ]
    },
    {
      id: "focus",
      title: "Current Focus",
      items: [
        { label: "AI/ML", icon: SiTensorflow },
        { label: "TensorFlow", icon: SiTensorflow },
        { label: "Scikit-learn", icon: SiScikitlearn },
        { label: "PyTorch", icon: SiPytorch },
        { label: "Deep Learning", icon: SiTensorflow },
        { label: "Computer Vision", icon: SiPython },
        { label: "NLP", icon: SiTensorflow }
      ]
    },
    {
      id: "tools",
      title: "Tools I Use Daily",
      items: [
        { label: "Python", icon: SiPython },
        { label: "Java", icon: FaJava },
        { label: "JavaScript", icon: SiJavascript },
        { label: "C", icon: SiC },
        { label: "Git", icon: SiGit },
        { label: "GitHub", icon: SiGithub },
        { label: "Figma", icon: SiFigma },
        { label: "VS Code", icon: DiVisualstudio }
      ]
    }
  ];

  return (
    <section id="tools" className="tools-section dark-theme">
      {/* Heading aligned with global container padding */}
      <div className="tools-heading-wrapper">
        <div className="eyebrow mono">STACK</div>
        <h2 className="display">Tech Stack &amp; Focus</h2>
      </div>
      
      {/* Edge-to-edge rows */}
      <div className="interactive-rows">
        {sections.map((sec) => (
          <div 
            key={sec.id}
            className="interactive-row"
            onMouseEnter={() => setHoveredSection(sec.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Heading text (disappears on hover) */}
            <div className="row-content-wrapper">
              <div className="row-title display">
                {sec.title}
              </div>
            </div>
            
            {/* Marquee band (appears on hover, edge-to-edge, white background, dark text/logos) */}
            <div className={`marquee-band ${hoveredSection === sec.id ? "active" : ""}`}>
              <div className="marquee-track">
                {/* Repeated array for continuous flow */}
                {Array(6).fill(sec.items).flat().map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <span key={idx}>
                      {Icon && <Icon className="marquee-icon" />}
                      {item.label.toUpperCase()}
                      <span className="marquee-separator">✦</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
