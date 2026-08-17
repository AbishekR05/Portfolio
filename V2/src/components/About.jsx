import React from "react";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="about" className="about-section dark-theme">
      <div className="about-container container">
        
        {/* Split grid */}
        <div className="about-grid">
          
          {/* Left Column: Context / Text */}
          <div className="about-content">
            <motion.h3 
              className="eyebrow-text section-eyebrow"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={textVariants}
            >
              ABOUT ME
            </motion.h3>
            
            <motion.h2 
              className="about-headline display-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={textVariants}
            >
              CRAFTING LOGICAL ARCHITECTURE
            </motion.h2>

            <motion.p 
              className="about-para body-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={textVariants}
            >
              I am a developer who builds high-performance digital systems. Focused on robust backend pipelines and modular front-end code bases, I translate complex technical structures into simple, reliable interfaces.
            </motion.p>

            <motion.p 
              className="about-para body-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={textVariants}
            >
              From custom API microservices resolving heavy concurrent operations, to smooth scroll-driven interactive experiences—my approach centers on architectural neatness and performance profiling.
            </motion.p>
          </div>

          {/* Right Column: Dynamic Statistics List */}
          <motion.div 
            className="stat-list mono"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={textVariants}
          >
            <div className="stat-row">
              <span className="stat-label">PROJECTS SHIPPED</span>
              <span className="stat-value display-text">5+</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">ACTIVE PRODUCTS</span>
              <span className="stat-value display-text">LIVE</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">CURRENT FOCUS</span>
              <span className="stat-value display-text">AI + SYSTEMS</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">AVAILABILITY</span>
              <span className="stat-value display-text">OPEN</span>
            </div>
          </motion.div>

        </div>

        {/* Bottom Education HUD */}
        <motion.div 
          className="about-footer-hud"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          <span className="education-label eyebrow-text">EDUCATION://</span>
          <span className="education-val caption-text">B.Tech CS + Business Systems — RIT Chennai</span>
        </motion.div>

      </div>
    </section>
  );
}
