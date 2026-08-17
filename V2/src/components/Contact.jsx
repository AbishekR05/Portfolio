import React from "react";
import { motion } from "framer-motion";
import goldRedCrystals from "../assets/gold_red_crystals.jpg";
import blueSwirl from "../assets/blue_swirl.jpg";
import "./Contact.css";

export default function Contact() {
  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
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
    <section id="contact" className="contact-section">
      <div className="contact-container container">
        
        {/* Split Grid */}
        <div className="contact-grid">
          
          {/* Left Column: Sliced Title & Social Links */}
          <div className="contact-left">
            <div className="mask-wrapper">
              <motion.h2 
                className="contact-headline display-text" 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
              >
                CONTACT
              </motion.h2>
            </div>
            
            <div className="contact-links-container">
              <div className="mask-wrapper">
                <motion.div 
                  className="contact-links" 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10% 0px" }}
                >
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
            </div>
          </div>

          {/* Right Column: Copy Blocks & Image Assets */}
          <div className="contact-right">
            
            {/* Block 1 */}
            <div className="contact-block">
              <div className="mask-wrapper">
                <motion.p 
                  className="contact-copy body-text" 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10% 0px" }}
                >
                  October. Eager to join an <em>innovative team</em> and contribute to <em>ambitious projects</em>.
                </motion.p>
              </div>
              <div className="contact-img-box img-top">
                <img src={blueSwirl} alt="Blue Swirl Graphic" className="contact-grid-img" />
              </div>
            </div>

            {/* Block 2 */}
            <div className="contact-block block-reverse">
              <div className="contact-img-box img-bottom">
                <img src={goldRedCrystals} alt="Red Gold Crystals Graphic" className="contact-grid-img" />
              </div>
              <div className="mask-wrapper">
                <motion.p 
                  className="contact-copy body-text" 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10% 0px" }}
                >
                  I'm available for freelance missions <em>worldwide</em>, on your <em>ambitious projects</em> and <em>international collaborations</em>.
                </motion.p>
              </div>
            </div>

          </div>

        </div>

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
