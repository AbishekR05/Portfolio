# Portfolio Website — Implementation Spec

A single-page React portfolio with a cinematic scroll-driven narrative:
**Hero → Black Takeover → Horizontal Project Scroll → About → Tools (hover marquee) → Contact.**

This doc is written to be handed directly to an AI coding agent (e.g. Antigravity). It specifies stack, structure, tokens, and exact behavior for every section so there's no ambiguity during implementation.

---

## 1. Tech Stack

| Purpose                                       | Library                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Framework                                     | React 18 + Vite                                                                                       |
| Scroll orchestration / pinning                | `gsap` + `gsap/ScrollTrigger` + `@gsap/react` (`useGSAP` hook)                                        |
| Smooth/inertia scroll                         | `lenis` (`@studio-freight/lenis`) synced to GSAP's ticker                                             |
| Micro-interactions (hover, mount transitions) | `framer-motion`                                                                                       |
| Tool/tech icons                               | `react-icons` (`si` set — SiPython, SiFlask, SiNextdotjs, SiReact, SiNodedotjs, SiExpress, SiMongodb) |
| Fonts                                         | Self-hosted or Google Fonts (see Typography)                                                          |

Install:

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install gsap @gsap/react lenis framer-motion react-icons
```

> Use GSAP for anything that must be **scroll-position-driven** (the capsule takeover, the horizontal project rail). Use Framer Motion for anything **event-driven** (hover states, mount fade-ins, the marquee toggle). Don't mix the two for the same animation — pick one owner per interaction.

---

## 2. Design Tokens

Derived from the reference screenshots: stark black/white, bold condensed display type, one red accent used as a "correction mark," not a decoration.

**Color**

```css
--bg-light: #f4f3ef; /* hero background, off-white not pure white */
--bg-dark: #0a0a0a; /* takeover / tools / contact background */
--ink: #111111; /* primary text on light */
--paper: #f4f3ef; /* primary text on dark */
--accent-red: #e8382d; /* strike-through mark, small live indicators */
--muted: #8a8a85; /* secondary/caption text */
```

**Type**

- Display (headlines, "BUILDING SYSTEMS THAT WORK"): a bold condensed grotesk — **Archivo Black** or **Anton** (Google Fonts). All caps, tight tracking (-0.01em), line-height 0.95.
- Body / captions / nav: **Inter** or **Neue Haas Grotesk Text** substitute — regular/medium weights only.
- Numeric/utility (stats, tool labels): Inter, uppercase, letter-spacing +0.08em, small size — this is the "eyebrow" voice used under each stat.

**Layout**

- Section width: full-bleed, content max-width 1200px centered, 5–8vw side gutters.
- Every major section is `100vh` and scroll-snapped or pinned — see per-section spec below.

---

## 3. Site Structure

```
src/
  main.jsx
  App.jsx                 // mounts Lenis, renders sections in order
  lib/
    useLenis.js            // Lenis + GSAP ScrollTrigger sync
  components/
    Hero.jsx
    TakeoverStats.jsx       // the black capsule → full black screen w/ stats
    ProjectsHorizontal.jsx  // pinned horizontal-scroll rail
    About.jsx
    Tools.jsx                // grid + hover marquee
    Contact.jsx
  data/
    projects.js
    tools.js
  styles/
    tokens.css
    global.css
```

Render order in `App.jsx` is literally the scroll order: `Hero → TakeoverStats → ProjectsHorizontal → About → Tools → Contact`.

---

## 4. Global Scroll Setup

Lenis must drive GSAP's ScrollTrigger, or the pinned sections will desync from the smooth-scroll easing.

```js
// lib/useLenis.js
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, []);
}
```

Call `useLenis()` once at the top of `App.jsx`. Respect `prefers-reduced-motion`: if set, skip Lenis entirely and fall back to native scroll + instant (no-scrub) section transitions.

---

## 5. Section 1 — Hero

**Reference:** Image 1.

**Layout:** Centered, two-line headline set in the display face, all caps:

```
BUILDING SYSTEMS
THAT (●) WORK
```

- `(●)` is a horizontally-stretched black pill/capsule (an `<img>` or CSS-shaped `<div>`) inline with the text, roughly matching the cap-height of the surrounding words, containing a small looping abstract video/gradient texture (silver-blue swirl in the reference).
- The word **WORK** has a hand-drawn-style red strikethrough across it (an inline SVG path with a squiggly/organic stroke, `stroke: var(--accent-red)`), implying "building systems that work isn't the real pitch — what happens next is."
- Background: `var(--bg-light)`.
- A small eyebrow/nav bar at the very top (logo mark or initials, left; nav links or a "scroll" indicator, right).

**Motion:**

- On mount: headline lines fade/slide up (`y: 24 → 0, opacity: 0 → 1`, staggered per line, Framer Motion, ~0.6s, ease `[0.16,1,0.3,1]`).
- The red strike draws itself in via SVG `stroke-dashoffset` animation, delayed to land just after the text settles.
- The pill's internal video/texture autoplays muted+looped, no controls.

**Build note:** the pill and the strike-through are two separate elements you will reuse — the **pill is the hero of the next section's transition** (Section 6), so build it as its own component (`<TakeoverPill />`) positioned so its bounding box can be measured/animated by GSAP.

---

## 6. Section 2 — The Black Takeover (scroll-driven)

**Reference:** Images 1 → 2 transition.

This is the centerpiece scroll effect: the small black pill from the hero **scales up to cover the entire viewport**, becoming a full black screen that then reveals the stats.

**Technique — pinned scale-up:**

1. Pin the Hero section (`ScrollTrigger.create({ pin: true, trigger: '#hero', start: 'top top', end: '+=150%', scrub: 1 })`).
2. On that same scroll range, animate the pill (`.takeover-pill`) with GSAP from its natural hero size to a `scale`/`clipPath` that covers `100vw × 100vh`, positioned `fixed`/`absolute` centered.
   - Prefer animating `clip-path: inset()` or a `border-radius` shrinking to `0` alongside `scale` growth — this reads as the pill "unrolling" into a rectangle, matching the reference where the capsule's rounded ends flatten into screen edges.
   - Simultaneously fade out the hero headline text (`opacity → 0`, slight `y` drift) as the pill grows, so by end of scrub only black remains.
3. Once the pill fully covers the viewport (`clip-path: inset(0)`, `border-radius: 0`), it **becomes** the background of the next pinned scene — the stats.

```js
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=150%",
      scrub: 1,
      pin: true,
    },
  });

  tl.to(".hero-copy", { opacity: 0, y: -40, ease: "power1.out" }, 0).to(
    ".takeover-pill",
    {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      top: 0,
      left: 0,
      xPercent: 0,
      yPercent: 0,
      ease: "none",
    },
    0,
  );
}, []);
```

**Stats reveal (Image 2):** once the pill covers the screen, run a second GSAP timeline (can be chained in the same pinned trigger or a new pin immediately after) that staggers in the three stat lines, each a bold title + small italic caption underneath:

```
5+ PROJECTS SHIPPED         — Full-stack Systems
ACTIVE PRODUCTS             — Live in Production
INTERNATIONAL CLIENTS       — Global Reach
```

Text color `var(--paper)`, stagger `0.15s`, fade+`y` up, same easing family as the hero.

---

## 7. Section 3 — Horizontal Project Scroll

**Reference:** Image 3 header ("The art of Antigravity") implies each project gets its own full-bleed card as you scroll through this rail; user wants **normal vertical mouse-wheel scroll translated into horizontal motion**.

**Technique — pinned horizontal translate:**

```js
useGSAP(() => {
  const track = trackRef.current;
  const scrollLength = track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: -scrollLength,
    ease: "none",
    scrollTrigger: {
      trigger: "#projects",
      start: "top top",
      end: () => `+=${scrollLength}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
    },
  });
}, []);
```

```jsx
<section id="projects" className="projects-section">
  <div className="projects-track" ref={trackRef}>
    {projects.map((p) => (
      <ProjectCard key={p.slug} {...p} />
    ))}
  </div>
</section>
```

```css
.projects-section {
  height: 100vh;
  overflow: hidden;
}
.projects-track {
  display: flex;
  height: 100%;
  width: max-content;
}
.project-card {
  width: 90vw;
  max-width: 1100px;
  height: 100%;
  flex-shrink: 0;
  margin-right: 4vw;
}
```

- The section's total pinned scroll distance = `track.scrollWidth - viewportWidth`, so the user's ordinary vertical wheel scroll maps 1:1 to horizontal travel — no custom wheel-event hijacking needed, GSAP+ScrollTrigger handles the axis remap.
- Each `ProjectCard`: large project title (display font), thumbnail/screenshot, 1–2 line description, tech-stack tags, link out. Subtle parallax on the thumbnail (`yPercent` shift tied to scroll progress) adds depth without extra libraries.
- Progress indicator: thin horizontal bar or numbered counter (`01 / 06`) fixed bottom-right, width driven by the same scroll progress.

**Data shape (`data/projects.js`):**

```js
export const projects = [
  {
    slug: "project-one",
    title: "Project One",
    description: "...",
    stack: ["React", "Node.js"],
    image: "/projects/one.jpg",
    url: "https://...",
  },
  // ...
];
```

---

## 8. Section 4 — About Me

Standard pinned-fade section, background `var(--bg-light)`. Content: a short first-person paragraph, portrait or abstract graphic (reuse the shard/crystal texture style seen in Image 4's contact photos for visual continuity), and an "education" line (e.g. degree • institution) styled the same as the small caption under Image 3's tool icons.

Motion: simple scroll-triggered fade/slide-up on paragraph and image, no pinning required — this section is a breather between the two high-motion set-pieces around it.

---

## 9. Section 5 — Tools (hover-triggered marquee)

**Reference:** Image 3 lower half — icon row (Flask, Next.js, React, Node.js, Express, MongoDB, Python) under "CURRENT FOCUS / TOOLS I USE DAILY".

**Default state:** a static centered row/grid of tool icons + labels (`react-icons/si`), dark background, quiet.

**Hover behavior:** hovering **the section** (or a "Tools I use daily" trigger label) starts an infinite horizontal marquee of the same icon set, replacing or overlaying the static grid — motion is the reward for engagement, not ambient by default (keeps the page calm elsewhere, per the reference's restrained feel).

Implementation — CSS marquee, animation state toggled via a class from Framer Motion `onHoverStart`/`onHoverEnd` (or plain React state):

```jsx
function ToolsMarquee({ tools }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="tools-section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`marquee-track ${hovered ? "is-playing" : ""}`}>
        {[...tools, ...tools].map(
          (
            t,
            i, // duplicated for seamless loop
          ) => (
            <span className="tool-chip" key={i}>
              <t.icon /> {t.label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
```

```css
.marquee-track {
  display: flex;
  gap: 3rem;
  width: max-content;
  transform: translateX(0);
}
.marquee-track.is-playing {
  animation: marquee 18s linear infinite;
}
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  } /* -50% because content is duplicated */
}
```

Pause on individual icon hover (`.tool-chip:hover { animation-play-state: paused }` on a parent toggle, or just accept full-row pause) if you want a moment to read a label.

---

## 10. Section 6 — Contact

**Reference:** Image 4.

**Layout:** Split composition —

- Left: giant `CONTACT` in display face, stacked links below (GitHub, LinkedIn, Behance) as a simple vertical list, generous line-height, underline-on-hover.
- Right: two staggered images (abstract/texture shots, matching the site's visual motif) with adjacent short copy blocks — availability blurb ("Eager to join an innovative team and contribute to ambitious projects.") and a freelance-availability note ("I'm available for freelance missions worldwide, on your ambitious projects and international collaborations."), key phrases set in italic for emphasis exactly as in the reference.
- Footer row: small print — copyright, back-to-top.

Motion: fade/slide-up on scroll-into-view (Framer Motion `whileInView`), no pinning — this is the resting point of the page.

---

## 11. Cross-Cutting Concerns

- **Reduced motion:** wrap every GSAP/Framer animation config to check `window.matchMedia('(prefers-reduced-motion: reduce)')`; when true, disable Lenis, skip pinning/scrub, and use instant `whileInView` fades only.
- **Performance:** animate only `transform`/`opacity`/`clip-path`. Avoid animating `width`/`height`/`top`/`left` directly where possible — for the takeover pill, prefer `scale` + `clip-path` over literal width/height tweening if you hit jank; the pseudo-code above uses width/height for clarity but a `scale`-based version is worth profiling first.
- **Responsive:** on mobile, the pinned horizontal-scroll section should either (a) shrink `scrollLength` proportionally so it still works with touch scroll, or (b) fall back to a native horizontal `overflow-x: scroll` snap-carousel with `scroll-snap-type: x mandatory` and no pinning — simpler and more reliable on touch devices. Recommend (b) below `768px`.
- **Accessibility:** all icons need `aria-label`s, the strike-through SVG is `aria-hidden` (decorative), focus states remain visible even inside pinned sections, and the horizontal rail should also be reachable via arrow-key navigation when focused (`tabIndex` + keydown handler moving `scrollTrigger.progress`).
- **Section IDs** (`#hero`, `#projects`, etc.) double as anchor targets for an optional top-nav.

---

## 12. Build Order (recommended)

1. Scaffold Vite + install deps, set up `tokens.css` and fonts.
2. Static layout for all six sections with real copy/images, no animation — confirm structure and responsiveness first.
3. Wire up Lenis + ScrollTrigger globally.
4. Implement the Hero → Takeover pinned pill animation (hardest piece — isolate and test alone before adding the rest).
5. Implement the horizontal project rail.
6. Add remaining scroll-in fades (About, Contact) and the Tools hover marquee.
7. Pass on reduced-motion, mobile fallback, and a11y sweep.
8. Performance pass: Lighthouse + check for layout thrash from the pinned sections (`will-change: transform` on animated elements only, remove after animation completes if memory is a concern).
