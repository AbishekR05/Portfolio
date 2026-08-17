import React from "react";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  const textVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const slideRightVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
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
            <div className="mask-wrapper">
              <motion.h3 
                className="eyebrow-text section-eyebrow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                variants={slideRightVariants}
              >
                ABOUT ME
              </motion.h3>
            </div>
            
            <div className="mask-wrapper">
              <motion.h2 
                className="about-headline display-text"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                variants={slideRightVariants}
              >
                CRAFTING LOGICAL ARCHITECTURE
              </motion.h2>
            </div>

            <div className="mask-wrapper">
              <motion.p 
                className="about-para body-text"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                variants={textVariants}
              >
                I am an Artificial Intelligence and Data Science undergraduate focused on building AI-powered, scalable software systems. Combining robust machine learning pipelines with modular front-end architecture, I shape intelligent applications from databases to user interfaces.
              </motion.p>
            </div>

            <div className="mask-wrapper">
              <motion.p 
                className="about-para body-text"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                variants={textVariants}
              >
                From offline real-time subtitle translation to NIFTY 50 trading signals using XGBoost—my engineering approach prioritizes data validation, performance tuning, and explainable models.
              </motion.p>
            </div>
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
          <span className="education-val caption-text">B.Tech in Artificial Intelligence &amp; Data Science — Mepco Schlenk Engineering College, Sivakasi (CGPA: 7.72/10)</span>
        </motion.div>

      </div>
    </section>
  );
}
