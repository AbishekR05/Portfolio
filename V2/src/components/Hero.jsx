import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import pillTexture from "../assets/pill_texture.jpg";
import "./Hero.css";

export default function Hero({ pillRef, placeholderRef }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="hero" className="hero-section">
      {/* Top Navigation */}
      <header className="hero-nav">
        <div className="logo eyebrow-text">AR • PORTFOLIO</div>
        <nav className="nav-links eyebrow-text">
          <a href="#projects">PROJECTS</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>

      {/* Hero Headline */}
      <motion.div 
        className="hero-container container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-copy display-text">
          <motion.div variants={lineVariants} className="headline-line">
            BUILDING SYSTEMS
          </motion.div>
          <motion.div variants={lineVariants} className="headline-line flex-line">
            <span>THAT</span>
            <span ref={placeholderRef} className="pill-placeholder"></span>
            <span className="strikethrough-container">
              WORK
              <svg className="strikethrough-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                <motion.path 
                  d="M 2,12 Q 25,6 50,11 T 98,8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Shared Takeover Pill element (placed absolute inside #hero to scale smoothly) */}
      <div 
        ref={pillRef} 
        className="takeover-pill"
        style={{
          backgroundImage: `url(${pillTexture})`,
        }}
      >
        <div className="pill-overlay"></div>
      </div>
    </section>
  );
}
