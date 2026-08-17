import React from "react";
import { motion } from "framer-motion";
import goldRedCrystals from "../assets/gold_red_crystals.jpg";
import blueSwirl from "../assets/blue_swirl.jpg";
import "./Contact.css";

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
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

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <section id="contact" className="contact-section dark-theme">
      <div className="contact-container container">
        
        {/* Split Grid */}
        <motion.div 
          className="contact-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          
          {/* Left Column: Huge Title & Social Links */}
          <div className="contact-left">
            <motion.h2 className="contact-headline display-text" variants={itemVariants}>
              CONTACT
            </motion.h2>
            
            <motion.div className="contact-links" variants={itemVariants}>
              <a href="https://github.com/AbishekR05" target="_blank" rel="noopener noreferrer" className="contact-link display-text">
                GitHub
              </a>
              <a href="https://linkedin.com/in/abishek-r-917481359" target="_blank" rel="noopener noreferrer" className="contact-link display-text">
                LinkedIn
              </a>
              <a href="mailto:abishekramesh1976@gmail.com" className="contact-link display-text">
                Email
              </a>
            </motion.div>
          </div>

          {/* Right Column: Copy Blocks & Image Assets */}
          <div className="contact-right">
            
            {/* Block 1 */}
            <motion.div className="contact-block" variants={itemVariants}>
              <p className="contact-copy body-text">
                October. Eager to join an <em>innovative team</em> and contribute to <em>ambitious projects</em>.
              </p>
              <div className="contact-img-box img-top">
                <img src={blueSwirl} alt="Blue Swirl Graphic" className="contact-grid-img" />
              </div>
            </motion.div>

            {/* Block 2 */}
            <motion.div className="contact-block block-reverse" variants={itemVariants}>
              <div className="contact-img-box img-bottom">
                <img src={goldRedCrystals} alt="Red Gold Crystals Graphic" className="contact-grid-img" />
              </div>
              <p className="contact-copy body-text">
                I'm available for freelance missions <em>worldwide</em>, on your <em>ambitious projects</em> and <em>international collaborations</em>.
              </p>
            </motion.div>

          </div>

        </motion.div>

        {/* Footer Row */}
        <footer className="contact-footer">
          <div className="footer-copyright eyebrow-text">
            © {new Date().getFullYear()} ABISHEK RAMESH • ALL RIGHTS RESERVED
          </div>
          <a href="#hero" onClick={scrollToTop} className="back-to-top eyebrow-text">
            BACK TO TOP ↑
          </a>
        </footer>

      </div>
    </section>
  );
}
