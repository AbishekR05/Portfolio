import React, { useRef } from "react";
import { useLenis } from "./lib/useLenis";
import Hero from "./components/Hero";
import TakeoverStats from "./components/TakeoverStats";
import ProjectsHorizontal from "./components/ProjectsHorizontal";
import About from "./components/About";
import Tools from "./components/Tools";
import Contact from "./components/Contact";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Activate global smooth-scroll (Lenis + GSAP synced ticker)
  useLenis();

  const pillRef = useRef(null);
  const placeholderRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReduced) {
      // Bypass high-motion takeover effects for accessibility or mobile layout
      if (pillRef.current) {
        gsap.set(pillRef.current, { display: "none" });
      }
      return;
    }

    // Coordinates alignment helper for shared-element transition (FLIP approach)
    const alignPill = () => {
      if (!placeholderRef.current || !pillRef.current) return;
      
      const rect = placeholderRef.current.getBoundingClientRect();
      const heroEl = document.getElementById("hero");
      if (!heroEl) return;
      const heroRect = heroEl.getBoundingClientRect();
      
      // Pin relative coordinates within parent container
      gsap.set(pillRef.current, {
        left: rect.left - heroRect.left,
        top: rect.top - heroRect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: rect.height / 2, // Capsule border-radius
      });
    };

    // Align immediately
    alignPill();

    // Re-align on screen size transitions
    window.addEventListener("resize", alignPill);

    // Timeline for scroll-driven pill takeover scale-up
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=150%",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

    // Fade out text while expanding the pill
    tl.to(".hero-copy", {
      opacity: 0,
      y: -50,
      ease: "power1.inOut"
    }, 0)
    .to(pillRef.current, {
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.inOut",
    }, 0);

    return () => {
      window.removeEventListener("resize", alignPill);
    };
  }, []);

  return (
    <>
      <Hero pillRef={pillRef} placeholderRef={placeholderRef} />
      <TakeoverStats />
      <ProjectsHorizontal />
      <About />
      <Tools />
      <Contact />
    </>
  );
}
