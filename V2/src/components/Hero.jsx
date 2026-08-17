import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Hero.css";

export default function Hero() {
  const pinStageRef = useRef(null);
  const heroContentRef = useRef(null);
  const capsuleRef = useRef(null);
  const strikeWordRef = useRef(null);
  const voidPanelRef = useRef(null);
  const bootTextRef = useRef(null);

  useGSAP(() => {
    const pinStage = pinStageRef.current;
    const capsule = capsuleRef.current;
    const voidPanel = voidPanelRef.current;
    const heroContent = heroContentRef.current;
    const strikeWord = strikeWordRef.current;
    const bootText = bootTextRef.current;

    if (!pinStage || !capsule || !voidPanel || !heroContent || !strikeWord || !bootText) return;

    // Check accessibility/prefers-reduced-motion or mobile layout
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Bypass animations
      return;
    }

    // Function to calculate and position voidPanel directly over the capsule
    const positionVoidToCapsule = () => {
      const parentRect = pinStage.getBoundingClientRect();
      const capsuleRect = capsule.getBoundingClientRect();

      gsap.set(voidPanel, {
        left: capsuleRect.left - parentRect.left,
        top: capsuleRect.top - parentRect.top,
        width: capsuleRect.width,
        height: capsuleRect.height,
        borderRadius: capsuleRect.height / 2,
      });
    };

    // Position initially
    positionVoidToCapsule();

    // Re-align on resize
    window.addEventListener("resize", positionVoidToCapsule);

    // Create the pin and takeover timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinStage,
        start: "top top",
        end: "+=140%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      strikeWord,
      { "--strike": 0 },
      { "--strike": 1, duration: 0.18, ease: "power1.in" },
      0.02
    )
    .to(
      voidPanel,
      {
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        duration: 0.55,
        ease: "power2.inOut",
      },
      0.2
    )
    .to(
      heroContent,
      { opacity: 0, y: -30, duration: 0.25 },
      0.15
    )
    .to(
      bootText,
      { opacity: 1, duration: 0.2 },
      0.55
    )
    .to(
      bootText,
      { opacity: 0, duration: 0.15 },
      0.85
    );

    return () => {
      window.removeEventListener("resize", positionVoidToCapsule);
    };
  }, { scope: pinStageRef });

  return (
    <section ref={pinStageRef} className="pin-stage" id="hero">
      {/* Top Nav (built-in like Claude's) */}
      <nav className="nav">
        <span>ABISHEK / SYSTEMS &amp; INTERFACES</span>
        <span className="mono">SIVAKASI, IN — 2026</span>
      </nav>

      {/* Hero Content */}
      <div ref={heroContentRef} className="hero-content">
        <div className="eyebrow mono">PORTFOLIO — UI/UX &amp; FULLSTACK</div>
        <h1 className="headline display">
          <span>I DESIGN</span>
          <span>INTERFACES</span>
          <span>THAT</span>
          <span className="capsule-wrap">
            <span ref={capsuleRef} className="capsule display">
              <span ref={strikeWordRef} className="strike">DON'T</span>
            </span>
          </span>
          <span>WORK.</span>
        </h1>
      </div>

      {/* Hero Footer */}
      <div className="hero-foot">
        <span>[ AI STUDENT / FULLSTACK DEV ]</span>
        <span className="scroll-cue">
          <span className="dot"></span> SCROLL TO ENTER
        </span>
      </div>

      {/* Expanding Void Panel */}
      <div ref={voidPanelRef} className="void-panel"></div>

      {/* Booting Text (revealed during the void takeover) */}
      <div ref={bootTextRef} className="boot-text mono">
        SYSTEM ONLINE ///&nbsp; LOADING PROJECT INDEX&nbsp; ///&nbsp; 03 SHIPPED
      </div>
    </section>
  );
}
