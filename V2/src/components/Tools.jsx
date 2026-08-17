import React, { useState } from "react";
import { tools } from "../data/tools";
import "./Tools.css";

export default function Tools() {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate tools array for seamless looping marquee
  const marqueeTools = [...tools, ...tools, ...tools, ...tools];

  return (
    <section 
      id="tools" 
      className="tools-section dark-theme"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container tools-header-container">
        <h3 className="eyebrow-text header-focus">CURRENT FOCUS</h3>
        <h2 className="display-text header-daily">TOOLS I USE DAILY</h2>
      </div>

      {/* Interactive Tool Rail */}
      <div className="tools-rail-container">
        
        {/* State 1: Static Centered Row (Default) */}
        <div className={`tools-static-grid ${isHovered ? "fade-out" : "fade-in"}`}>
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div className="tool-chip static-chip" key={`static-${idx}`}>
                <Icon className="tool-icon" aria-label={tool.label} />
                <span className="tool-label eyebrow-text">{tool.label}</span>
              </div>
            );
          })}
        </div>

        {/* State 2: Active Scrolling Marquee (Hovered) */}
        <div className={`tools-marquee-track ${isHovered ? "fade-in is-playing" : "fade-out"}`}>
          {marqueeTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div className="tool-chip marquee-chip" key={`marquee-${idx}`}>
                <Icon className="tool-icon" aria-label={tool.label} />
                <span className="tool-label eyebrow-text">{tool.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
