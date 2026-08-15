import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './App.css';

// Import Figma assets
import waving from './assets/waving.png';
import cameraGotcha from './assets/camera_gotcha.png';
import rasgula from './assets/rasgula.png';
import noodles from './assets/noodles.png';
import peaceAvatar from './assets/Peace.png';
import laptopClosed from './assets/laptop_closed.png';
import laptopOpen from './assets/laptop_open.png';
import figmaLogo from './assets/figma_logo.svg';
import claudeLogo from './assets/claude_logo.svg';
import githubLogo from './assets/github_logo.svg';
import geminiLogo from './assets/gemini_logo.svg';
import linkedinLogo from './assets/linkedin_logo.svg';
import gmailLogo from './assets/gmail_logo.svg';
import folderIcon from './assets/folder_icon.png';
import resumeIcon from './assets/resume_icon.png';

// Register GSAP plugin
gsap.registerPlugin(Draggable);

// Coordinates & canvas dimensions
const CANVAS_WIDTH = 3200;
const CANVAS_HEIGHT = 2000;

// Zone coordinates matching Figma files
const ZONE_HERO = { left: 300, top: 300, width: 1366, height: 768 };

export default function App() {
  const canvasRef = useRef(null);
  const laptopRef = useRef(null);
  const viewportRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState('main');
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);
  const mainDragRef = useRef(null);

  // Calculates offset coordinates to center a target frame in the viewport
  const getCenterCoords = (zone) => {
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;

    const zoneCenterX = zone.left + (zone.width / 2);
    const zoneCenterY = zone.top + (zone.height / 2);

    let targetX = (vpWidth / 2) - zoneCenterX;
    let targetY = (vpHeight / 2) - zoneCenterY;

    const minX = Math.min(0, vpWidth - CANVAS_WIDTH);
    const minY = Math.min(0, vpHeight - CANVAS_HEIGHT);

    targetX = Math.max(minX, Math.min(0, targetX));
    targetY = Math.max(minY, Math.min(0, targetY));

    return { x: targetX, y: targetY };
  };

  useEffect(() => {
    // 1. Setup main canvas dragging
    const minX = Math.min(0, window.innerWidth - CANVAS_WIDTH);
    const minY = Math.min(0, window.innerHeight - CANVAS_HEIGHT);

    const canvasDrag = Draggable.create(canvasRef.current, {
      type: "x,y",
      edgeResistance: 0.5,
      bounds: { minX, maxX: 0, minY, maxY: 0 },
      inertia: true,
      zIndexBoost: false
    })[0];

    mainDragRef.current = canvasDrag;

    // Center on Hero Zone on load
    const initialCoords = getCenterCoords(ZONE_HERO);
    gsap.set(canvasRef.current, { x: initialCoords.x, y: initialCoords.y });
    canvasDrag.update();

    // 2. Enable dragging for elements — disable canvas drag while item is being dragged
    const itemsDrag = Draggable.create(".illustration, .card-item", {
      bounds: canvasRef.current,
      onDragStart: function() {
        canvasDrag.disable();
        gsap.set(this.target, { zIndex: 100 });
      },
      onDragEnd: function() {
        canvasDrag.enable();
        gsap.set(this.target, { zIndex: 10 });
      }
    });

    // 3. Custom laptop dragging setup
    let isLaptopDragging = false;
    const laptopDrag = Draggable.create(laptopRef.current, {
      bounds: canvasRef.current,
      onDragStart: function() {
        isLaptopDragging = true;
        canvasDrag.disable();
        gsap.set(this.target, { zIndex: 100 });
      },
      onDragEnd: function() {
        setTimeout(() => { isLaptopDragging = false; }, 50);
        canvasDrag.enable();
        gsap.set(this.target, { zIndex: 25 });
      }
    })[0];

    // Click handler for laptop toggle
    const handleLaptopClick = () => {
      if (isLaptopDragging) return;
      setIsLaptopOpen(prev => !prev);
    };

    const laptopEl = laptopRef.current;
    laptopEl.addEventListener('click', handleLaptopClick);

    // 4. Floating animations
    const bob1 = gsap.to("#ill-waving", { y: "-=10", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob2 = gsap.to("#ill-rasgula", { y: "+=6", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob3 = gsap.to("#ill-noodles", { y: "-=6", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // Handle window resize bounds
    const handleResize = () => {
      const newMinX = Math.min(0, window.innerWidth - CANVAS_WIDTH);
      const newMinY = Math.min(0, window.innerHeight - CANVAS_HEIGHT);

      canvasDrag.applyBounds({
        minX: newMinX,
        maxX: 0,
        minY: newMinY,
        maxY: 0
      });

      // Maintain centering of active zone on resize
      const coords = getCenterCoords(ZONE_HERO);
      gsap.set(canvasRef.current, { x: coords.x, y: coords.y });
      canvasDrag.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup drag hooks and floating timelines on unmount
    return () => {
      canvasDrag.kill();
      itemsDrag.forEach(d => d.kill());
      laptopDrag.kill();
      laptopEl.removeEventListener('click', handleLaptopClick);
      bob1.kill();
      bob2.kill();
      bob3.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="viewport" ref={viewportRef}>
      
      {/* Fixed HUD Interface Layer */}
      <div className="hud-layer">
        <header className="hud-header">
          <div 
            className="logo" 
            id="hud-logo"
            style={{
              opacity: currentPage !== 'main' ? 0 : 1,
              transform: currentPage !== 'main' ? 'translateY(-50%) translateX(-20px)' : 'translateY(-50%) translateX(0)',
              pointerEvents: currentPage !== 'main' ? 'none' : 'auto'
            }}
          >
            Abishek Ramesh
          </div>
          
          <button 
            className={`back-btn ${currentPage !== 'about' ? 'hidden' : ''}`} 
            id="back-to-main-btn"
            onClick={() => setCurrentPage('main')}
          >
            Back to main
          </button>
          
          <button 
            className={`explore-btn ${currentPage !== 'main' ? 'hidden' : ''}`} 
            id="explore-hud-btn"
            onClick={() => setCurrentPage('about')}
          >
            Click to Explore
          </button>
        </header>

        {/* Sidebar Dock (only active/visible on main landing view) */}
        <aside 
          className="hud-sidebar" 
          id="hud-sidebar-dock"
          style={{
            opacity: currentPage !== 'main' ? 0 : 1,
            pointerEvents: currentPage !== 'main' ? 'none' : 'auto'
          }}
        >
          <div className="sidebar-icon" title="Figma">
            <img src={figmaLogo} alt="Figma" />
          </div>
          <div className="sidebar-icon" title="Claude">
            <img src={claudeLogo} alt="Claude" />
          </div>
          <div className="sidebar-icon" title="GitHub">
            <img src={githubLogo} alt="GitHub" />
          </div>
          <div className="sidebar-icon" title="Gemini">
            <img src={geminiLogo} alt="Gemini" />
          </div>
        </aside>

        {/* Socials Sidebar Dock — right side */}
        <aside
          className="hud-sidebar socials-sidebar"
          id="hud-socials-dock"
          style={{
            opacity: currentPage !== 'main' ? 0 : 1,
            pointerEvents: currentPage !== 'main' ? 'none' : 'auto'
          }}
        >
          <a className="sidebar-icon" href="https://www.linkedin.com/in/abishek-r-917481359/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <img src={linkedinLogo} alt="LinkedIn" />
          </a>
          <a className="sidebar-icon" href="https://github.com/AbishekR05" target="_blank" rel="noopener noreferrer" title="GitHub">
            <img src={githubLogo} alt="GitHub" />
          </a>
          <a className="sidebar-icon" href="mailto:abishekramesh1976@gmail.com" title="Gmail">
            <img src={gmailLogo} alt="Gmail" />
          </a>
        </aside>
      </div>

      {/* Main Draggable Map Canvas */}
      <main id="canvas" ref={canvasRef} style={{ display: currentPage === 'main' ? 'block' : 'none' }}>
        
        {/* Zone 1: Landing Hero Frame */}
        <section className="canvas-zone" id="zone-hero">
          <div className="hero-wrapper">
            
            {/* Draggable Hover-Laptop (positioned according to Figma coordinates) */}
            <div 
              className={`laptop-container laptop-hover-container ${isLaptopOpen ? 'is-open' : ''}`} 
              id="draggable-laptop" 
              ref={laptopRef}
            >
              <img className="laptop-base-closed" src={laptopClosed} alt="Closed Laptop" />
              <img className="laptop-hover-open" src={laptopOpen} alt="Open Laptop" />
            </div>
            
            {/* Waving/Gotcha guy (positioned according to Figma coordinates) */}
            <div className="illustration waving-hover-container" id="ill-waving">
              <img className="waving-base" src={waving} alt="Person waving" />
              <img className="waving-hover-gotcha" src={cameraGotcha} alt="Person gotcha with camera" />
            </div>
            
            {/* Rasgullas (positioned according to Figma coordinates) */}
            <div className="illustration" id="ill-rasgula">
              <img src={rasgula} alt="Bowl of sweet Rasgullas" />
            </div>

            {/* Noodles (positioned according to Figma coordinates) */}
            <div className="illustration" id="ill-noodles">
              <img src={noodles} alt="Bowl of hot noodles" />
            </div>

            {/* Central Titles */}
            <div className="hero-center">
              <h1 className="hero-title">Be Creative</h1>
              <p className="hero-subtitle">&gt;AI/DS Student &nbsp; &gt;Full Stack Developer &nbsp; &gt;UI/UX Designer</p>
            </div>

            {/* Draggable Navigation & Contact Cards */}
            <div className="card-item" id="card-about-link" onClick={() => setCurrentPage('about')}>
              <h2 className="card-title">About me</h2>
              <img className="card-about-avatar" src={peaceAvatar} alt="Peace avatar illustration" />
              <span className="card-action">Get To know about me &gt;</span>
            </div>

            <div className="card-item" id="card-contact" onClick={() => setCurrentPage('contact')}>
              <div className="contact-header">Let’s Talk</div>
              <div className="contact-sub">Good work starts with good convos</div>
              <div className="contact-email">abishekramesh1976@gmail.com</div>
            </div>

            {/* Resume Folder Illustration — sized to card frame width */}
            <div className="illustration resume-folder-container" id="ill-resume-folder">
              <div className="folder-wrapper">
                <img className="folder-icon-img" src={folderIcon} alt="Resume Folder" />
                
                {/* Floating Resume PDF Icon / Text */}
                <a href="/resume.pdf" download="Abishek_Resume.pdf" className="floating-resume-link" title="Download Resume">
                  <img src={resumeIcon} alt="PDF Resume" className="resume-icon-img" />
                  <span className="resume-download-txt">Resume</span>
                </a>
              </div>
              <span className="folder-label">Final_Final_Final</span>
            </div>

          </div>
        </section>
      </main>

      {/* Zone 2: Story Detail Panel (rendered as separate fullscreen page overlay) */}
      {currentPage === 'about' && (
        <section className="story-page-fullscreen">
          {/* Top Left Back to Home Button */}
          <button className="about-back-btn" onClick={() => setCurrentPage('main')}>
            ← Back to Home
          </button>

          <div className="about-wrapper">
            
            <header className="about-header">
              <h2 className="about-title">My Story</h2>
              <p className="about-timeline">Architecture &nbsp;→&nbsp; Brand &nbsp;→&nbsp; Web &nbsp;→&nbsp; AI</p>
            </header>

            <div className="about-content">
              <div className="about-left">
                <p>I started in architecture, moved into brand and packaging design, and somewhere along the way fell in love with building for the screen. Now I sit at the intersection of design thinking and emerging technology — making things that feel considered, from the first sketch to the final pixel.</p>
                <p>I build with AI the way a photographer works with light — it's a medium, not a shortcut. The taste, the decisions, the creative direction? That's still very human. That's still mine.</p>
              </div>
              
              <div className="about-right">
                <blockquote className="about-quote">
                  I believe the best work happens when craft meets curiosity. I care about the details that most people won't notice but everyone will feel — the weight of a typeface, the rhythm of a layout, the moment an interaction earns a smile.
                </blockquote>
              </div>
            </div>

            {/* Portfolio Projects Showcase */}
            <div className="about-showcase">
              <span>Portfolio Showcase / Interactive Gallery Coming Soon</span>
            </div>

            {/* Skill Badge Elements */}
            <footer className="badge-container">
              <div className="badge-item badge-figma">
                <span>AI Student</span>
              </div>
              <div className="badge-item badge-github">
                <span>Full Stack Developer</span>
              </div>
              <div className="badge-item badge-gemini">
                <span>UI/UX Designer</span>
              </div>
              <div className="badge-item badge-claude">
                <span>Loves Learning</span>
              </div>
            </footer>

          </div>
        </section>
      )}

      {/* Zone 3: Contact Fullscreen Page Overlay */}
      {currentPage === 'contact' && (
        <section className="contact-page-fullscreen">
          {/* Top Left Back to Playground Button */}
          <button className="contact-back-btn" onClick={() => setCurrentPage('main')}>
            ← Back to Playground
          </button>

          <div className="contact-page-content">
            <h2 className="contact-page-title">
              Good work comes from <br />
              good conversations.
            </h2>
            
            <div className="contact-page-email-wrapper">
              <a href="mailto:abishekramesh1976@gmail.com" className="contact-page-email">
                abishekramesh1976@gmail.com
              </a>
              <div className="email-highlight-underline"></div>
            </div>

            <div className="contact-page-socials">
              <a 
                href="https://www.linkedin.com/in/abishek-r-917481359/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-social-link"
              >
                LINKEDIN
              </a>
              <a 
                href="https://github.com/AbishekR05" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-social-link"
              >
                GITHUB
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
