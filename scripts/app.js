// Register GSAP Draggable Plugin
gsap.registerPlugin(Draggable);

// Coordinates & dimensions based on CSS layout
const CANVAS_WIDTH = 3200;
const CANVAS_HEIGHT = 2000;

const ZONE_HERO = { left: 300, top: 300, width: 1366, height: 768 };
const ZONE_ABOUT = { left: 1750, top: 200, width: 1366, height: 1027 };

// DOM Selectors
const canvas = document.getElementById('canvas');
const viewport = document.getElementById('viewport');
const cardAboutLink = document.getElementById('card-about-link');
const backToMainBtn = document.getElementById('back-to-main-btn');
const exploreHudBtn = document.getElementById('explore-hud-btn');
const hudLogo = document.getElementById('hud-logo');
const sidebarDock = document.getElementById('hud-sidebar-dock');
const laptop = document.getElementById('draggable-laptop');

let mainDraggable;
let activeZone = 'hero';

// Calculate centered position for a given zone
function getCenterCoords(zone) {
  const vpWidth = window.innerWidth;
  const vpHeight = window.innerHeight;

  // Center of zone relative to canvas
  const zoneCenterX = zone.left + (zone.width / 2);
  const zoneCenterY = zone.top + (zone.height / 2);

  // Target canvas top-left coordinates to center the zone
  let targetX = (vpWidth / 2) - zoneCenterX;
  let targetY = (vpHeight / 2) - zoneCenterY;

  // Apply bounds
  const minX = Math.min(0, vpWidth - CANVAS_WIDTH);
  const minY = Math.min(0, vpHeight - CANVAS_HEIGHT);

  targetX = Math.max(minX, Math.min(0, targetX));
  targetY = Math.max(minY, Math.min(0, targetY));

  return { x: targetX, y: targetY };
}

// Center the camera on a specific zone with animation
function panToZone(zoneName) {
  activeZone = zoneName;
  const zone = zoneName === 'about' ? ZONE_ABOUT : ZONE_HERO;
  const target = getCenterCoords(zone);

  gsap.to(canvas, {
    x: target.x,
    y: target.y,
    duration: 1.2,
    ease: "power3.inOut",
    onUpdate: () => {
      // Sync the Draggable instance with the animated positions
      mainDraggable.update();
    },
    onComplete: () => {
      updateHUD(zoneName);
    }
  });

  // Pre-emptively update HUD transitions for responsive feel
  updateHUD(zoneName);
}

// Update HUD visibility based on active zone
function updateHUD(zoneName) {
  if (zoneName === 'about') {
    backToMainBtn.classList.remove('hidden');
    exploreHudBtn.classList.add('hidden');
    hudLogo.style.opacity = '0';
    hudLogo.style.transform = 'translateY(-50%) translateX(-20px)';
    sidebarDock.style.opacity = '0';
    sidebarDock.style.pointerEvents = 'none';
  } else {
    backToMainBtn.classList.add('hidden');
    exploreHudBtn.classList.remove('hidden');
    hudLogo.style.opacity = '1';
    hudLogo.style.transform = 'translateY(-50%) translateX(0)';
    sidebarDock.style.opacity = '1';
    sidebarDock.style.pointerEvents = 'auto';
  }
}

// Update Draggable Canvas Bounds dynamically on resize
function updateCanvasBounds() {
  const minX = Math.min(0, window.innerWidth - CANVAS_WIDTH);
  const minY = Math.min(0, window.innerHeight - CANVAS_HEIGHT);

  mainDraggable.applyBounds({
    minX: minX,
    maxX: 0,
    minY: minY,
    maxY: 0
  });
}

// Initialize Application
function init() {
  // 1. Create Main Canvas Dragging
  const minX = Math.min(0, window.innerWidth - CANVAS_WIDTH);
  const minY = Math.min(0, window.innerHeight - CANVAS_HEIGHT);

  const draggableInstances = Draggable.create(canvas, {
    type: "x,y",
    edgeResistance: 0.5,
    bounds: { minX, maxX: 0, minY, maxY: 0 },
    inertia: true, // Requires throwProps / inertia if loaded, fallback is standard drag
    onDrag: () => {
      // Dynamically calculate which zone is closer to update HUD
      const xVal = mainDraggable.x;
      const threshold = (minX / 2); // mid point of panning bounds
      if (xVal < threshold && activeZone !== 'about') {
        activeZone = 'about';
        updateHUD('about');
      } else if (xVal >= threshold && activeZone !== 'hero') {
        activeZone = 'hero';
        updateHUD('hero');
      }
    }
  });

  mainDraggable = draggableInstances[0];

  // 2. Center on Hero Zone on first load
  const initialCoords = getCenterCoords(ZONE_HERO);
  gsap.set(canvas, { x: initialCoords.x, y: initialCoords.y });
  mainDraggable.update();

  // 3. Make child illustrations and cards slightly draggable inside the canvas for depth/inertia
  Draggable.create(".illustration, .card-item", {
    bounds: "#canvas",
    onDragStart: function() {
      gsap.set(this.target, { zIndex: 100 });
    },
    onDragEnd: function() {
      // Revert z-index back to safe layout stack
      gsap.set(this.target, { zIndex: 10 });
    }
  });

  // 4. Custom laptop drag + click toggle
  let isLaptopDragging = false;
  Draggable.create(laptop, {
    bounds: "#canvas",
    onDragStart: function() {
      isLaptopDragging = true;
      gsap.set(this.target, { zIndex: 100 });
    },
    onDragEnd: function() {
      setTimeout(() => { isLaptopDragging = false; }, 50);
      gsap.set(this.target, { zIndex: 25 });
    }
  });

  laptop.addEventListener('click', () => {
    if (isLaptopDragging) return;
    laptop.classList.toggle('is-open');
  });

  // 5. Setup Action Listeners
  cardAboutLink.addEventListener('click', () => {
    panToZone('about');
  });

  backToMainBtn.addEventListener('click', () => {
    panToZone('hero');
  });

  exploreHudBtn.addEventListener('click', () => {
    panToZone('about');
  });

  // 6. Handle resizing
  window.addEventListener('resize', () => {
    updateCanvasBounds();
    // Re-center active zone on resize
    const zone = activeZone === 'about' ? ZONE_ABOUT : ZONE_HERO;
    const coords = getCenterCoords(zone);
    gsap.set(canvas, { x: coords.x, y: coords.y });
    mainDraggable.update();
  });

  // 7. Subtle floating bob animations for elements
  gsap.to("#ill-guy-laptop", { y: "+=10", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#ill-waving", { y: "-=10", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#ill-rasgula", { y: "+=6", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#card-about-link", { rotation: "-=1", duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#card-contact", { rotation: "+=1", duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
}

// Run on window load
window.addEventListener('load', init);
