import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './App.css';

// Import Figma assets
import personThinking from './assets/person_thinking.png';
import waving from './assets/waving.png';
import cameraGotcha from './assets/camera_gotcha.png';
import rasgula from './assets/rasgula.png';
import peaceAvatar from './assets/Peace.png';
import laptopClosed from './assets/laptop_closed.png';
import laptopOpen from './assets/laptop_open.png';
import figmaLogo from './assets/figma_logo.svg';
import claudeLogo from './assets/claude_logo.svg';
import githubLogo from './assets/github_logo.svg';
import geminiLogo from './assets/gemini_logo.svg';

// Register GSAP plugin
gsap.registerPlugin(Draggable);

// Coordinates & canvas dimensions
const CANVAS_WIDTH = 3200;
const CANVAS_HEIGHT = 2000;

const ZONE_HERO = { left: 300, top: 300, width: 1366, height: 768 };
const ZONE_ABOUT = { left: 1750, top: 200, width: 1366, height: 1027 };

export default function App() {
  const canvasRef = useRef(null);
  const laptopRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeZone, setActiveZone] = useState('hero');
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

  // Pan the camera view smoothly
  const panToZone = (zoneName) => {
    const zone = zoneName === 'about' ? ZONE_ABOUT : ZONE_HERO;
    const target = getCenterCoords(zone);

    gsap.to(canvasRef.current, {
      x: target.x,
      y: target.y,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        if (mainDragRef.current) mainDragRef.current.update();
      },
      onComplete: () => {
        setActiveZone(zoneName);
      }
    });

    setActiveZone(zoneName);
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
      onDrag: function() {
        const xVal = this.x;
        const threshold = minX / 2;
        if (xVal < threshold) {
          setActiveZone('about');
        } else {
          setActiveZone('hero');
        }
      }
    })[0];

    mainDragRef.current = canvasDrag;

    // Center on Hero Zone on load
    const initialCoords = getCenterCoords(ZONE_HERO);
    gsap.set(canvasRef.current, { x: initialCoords.x, y: initialCoords.y });
    canvasDrag.update();

    // 2. Enable dragging for elements
    const itemsDrag = Draggable.create(".illustration, .card-item", {
      bounds: canvasRef.current,
      onDragStart: function() {
        gsap.set(this.target, { zIndex: 100 });
      },
      onDragEnd: function() {
        gsap.set(this.target, { zIndex: 10 });
      }
    });

    // 3. Custom laptop dragging setup
    let isLaptopDragging = false;
    const laptopDrag = Draggable.create(laptopRef.current, {
      bounds: canvasRef.current,
      onDragStart: function() {
        isLaptopDragging = true;
        gsap.set(this.target, { zIndex: 100 });
      },
      onDragEnd: function() {
        setTimeout(() => { isLaptopDragging = false; }, 50);
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
    const bob1 = gsap.to("#ill-guy-laptop", { y: "+=10", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob2 = gsap.to("#ill-waving", { y: "-=10", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob3 = gsap.to("#ill-rasgula", { y: "+=6", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob4 = gsap.to("#card-about-link", { rotation: "-=1", duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const bob5 = gsap.to("#card-contact", { rotation: "+=1", duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });

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
      const zone = activeZone === 'about' ? ZONE_ABOUT : ZONE_HERO;
      const coords = getCenterCoords(zone);
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
      bob4.kill();
      bob5.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [activeZone]);

  return (
    <div id="viewport" ref={viewportRef}>
      
      {/* Fixed HUD Interface Layer */}
      <div className="hud-layer">
        <header className="hud-header">
          <div 
            className="logo" 
            id="hud-logo"
            style={{
              opacity: activeZone === 'about' ? 0 : 1,
              transform: activeZone === 'about' ? 'translateY(-50%) translateX(-20px)' : 'translateY(-50%) translateX(0)',
              pointerEvents: activeZone === 'about' ? 'none' : 'auto'
            }}
          >
            Abishek Ramesh
          </div>
          
          <button 
            className={`back-btn ${activeZone !== 'about' ? 'hidden' : ''}`} 
            id="back-to-main-btn"
            onClick={() => panToZone('hero')}
          >
            Back to main
          </button>
          
          <button 
            className={`explore-btn ${activeZone === 'about' ? 'hidden' : ''}`} 
            id="explore-hud-btn"
            onClick={() => panToZone('about')}
          >
            Click to Explore
          </button>
        </header>

        {/* Sidebar Dock (only active/visible on hero zone) */}
        <aside 
          className="hud-sidebar" 
          id="hud-sidebar-dock"
          style={{
            opacity: activeZone === 'about' ? 0 : 1,
            pointerEvents: activeZone === 'about' ? 'none' : 'auto'
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
      </div>

      {/* Main Draggable Map Canvas */}
      <main id="canvas" ref={canvasRef}>
        
        {/* Zone 1: Landing Hero Frame */}
        <section className="canvas-zone" id="zone-hero">
          <div className="hero-wrapper">
            
            {/* Element Illustrations */}
            <div className="illustration laptop-hover-container" id="ill-guy-laptop">
              <img className="laptop-base-closed" src={laptopClosed} alt="Closed Laptop" />
              <img className="laptop-hover-open" src={laptopOpen} alt="Open Laptop" />
            </div>
            
            <div className="illustration waving-hover-container" id="ill-waving">
              <img className="waving-base" src={waving} alt="Person waving" />
              <img className="waving-hover-gotcha" src={cameraGotcha} alt="Person gotcha with camera" />
            </div>
            
            <div className="illustration" id="ill-rasgula">
              <img src={rasgula} alt="Bowl of sweet Rasgullas" />
            </div>

            {/* Central Titles */}
            <div className="hero-center">
              <h1 className="hero-title">Be Creative</h1>
              <p className="hero-subtitle">&gt;AI/DS Student &nbsp; &gt;Full Stack Developer &nbsp; &gt;UI/UX Designer</p>
            </div>

            {/* Draggable Navigation & Contact Cards */}
            <div className="card-item" id="card-about-link" onClick={() => panToZone('about')}>
              <h2 className="card-title">About me</h2>
              <img className="card-about-avatar" src={peaceAvatar} alt="Peace avatar illustration" />
              <span className="card-action">Get To know about me &gt;</span>
            </div>

            <div className="card-item" id="card-contact">
              <div className="contact-header">Let’s Talk</div>
              <div className="contact-sub">Good work starts with good convos</div>
              <div className="contact-email">abishekramesh1976@gmail.com</div>
            </div>

            {/* Interactive Laptop */}
            <div 
              className={`laptop-container ${isLaptopOpen ? 'is-open' : ''}`} 
              id="draggable-laptop" 
              ref={laptopRef}
            >
              <img className="laptop-closed-img" src={laptopClosed} alt="Closed Laptop" />
              <img className="laptop-open-img" src={laptopOpen} alt="Open Laptop" />
              <div className="laptop-tooltip">Busy rn</div>
            </div>

          </div>
        </section>

        {/* Zone 2: Story Detail Panel */}
        <section className="canvas-zone" id="zone-about">
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
                <img src={figmaLogo} alt="Figma" />
                <span>Figma</span>
              </div>
              <div className="badge-item badge-github">
                <img src={githubLogo} alt="GitHub" />
                <span>GitHub</span>
              </div>
              <div className="badge-item badge-gemini">
                <img src={geminiLogo} alt="Gemini" />
                <span>Gemini</span>
              </div>
              <div className="badge-item badge-claude">
                <img src={claudeLogo} alt="Claude" />
                <span>Claude</span>
              </div>
            </footer>

          </div>
        </section>

      </main>
    </div>
  );
}
