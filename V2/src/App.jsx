import React from "react";
import { useLenis } from "./lib/useLenis";
import Hero from "./components/Hero";
import ProjectsHorizontal from "./components/ProjectsHorizontal";
import About from "./components/About";
import Tools from "./components/Tools";
import Contact from "./components/Contact";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Activate global smooth-scroll (Lenis + GSAP synced ticker)
  useLenis();

  return (
    <>
      <Hero />
      <ProjectsHorizontal />
      <About />
      <Tools />
      <Contact />
    </>
  );
}
