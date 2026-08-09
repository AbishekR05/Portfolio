# Non-Linear Portfolio — Content & Structure Spec

**Reference:** portfoliobyshruti.com (non-linear, drag-to-explore canvas, fixed scroll)
**You are:** UI/UX Designer, AI student, Fullstack Developer
**Core new feature:** Draggable laptop illustration that opens on click to reveal your projects

---

## 1. Concept

Instead of a scrolling page, the whole site lives on one large **fixed canvas** the visitor drags/pans around (mouse-drag on desktop, swipe on mobile — no vertical page-scroll). Content isn't stacked top-to-bottom; it's scattered across the canvas as physical "objects" — cards, illustrations, a photo, a laptop — like items on a desk. Nothing scrolls in the traditional sense; the *camera* moves, not the page.

Tone suggestion given your mix (design + AI + fullstack): part sketchbook, part IDE — a "workbench" feel rather than a pure mood-board feel. You can lean more visual-design or more technical depending on which audience you're optimizing for (recruiters/design vs. dev roles) — flag this if you want the copy tone adjusted.

---

## 2. Canvas Layout — Fixed/Global Elements

These stay pinned to the viewport regardless of canvas drag position (like the reference's dock and toolbar):

| Element | Position | Behavior |
|---|---|---|
| Left tool dock | Fixed left, vertical stack | Your tool/tech icons (see Section 4) |
| Bottom social dock | Fixed bottom, mac-dock style | LinkedIn / GitHub / Email / (Behance or portfolio-adjacent link) |
| Drag hint | Fixed, small, near center on load | "Drag to explore · Swipe to explore" — fades out after first interaction |
| Interaction counter (optional) | Fixed top-left | A small counter (like the "0") — could count objects dragged, or be dropped entirely if it doesn't serve a purpose for you |

---

## 3. Canvas Zones — What Lives Where

Think of the canvas as a loose grid of zones a visitor discovers by dragging. Suggested layout (you can rearrange):

```
        [About Card]         [Skills/Tools Card]
[Fun Card]        [HERO: Name + Title]        [Contact Card]
        [LAPTOP — draggable, opens on click]
```

### Hero (starting viewport, center)
- Your name
- One-line title: e.g. "UI/UX Designer · AI Student · Fullstack Developer"
- A short tagline about how you work (design-to-code, AI-assisted, etc.)
- Optional: a profile photo/illustration, styled to match the sketchbook feel

### About Card
- 2–4 sentences: who you are, your background, what you're currently focused on (AI study angle is a nice differentiator — mention it specifically, it's unusual and memorable)
- Optional: a short "how I work" note, similar to Shruti's "About This Portfolio" meta-note — e.g. how much of this site was AI-assisted, which tools, what your process looked like

### Skills/Tools Card + Left Dock
Split your stack into two tiers:
- **Left dock icons** (5–7 max, most-used/most-identity-defining tools): e.g. Figma, VS Code, React, Python/Node, an AI tool you use (Claude Code, Cursor, etc.), Git
- **Skills card** (fuller list, text-based): UI/UX Design, Prototyping, Frontend Dev (React/Next.js etc.), Backend/APIs, whatever your AI coursework covers (ML basics, prompt engineering, LLM tooling), Design Systems, etc.

*Send me your actual tool/skill list when ready and I'll help slot it in.*

### Fun/Personal Card
Reference used a chai recipe — the point is one card that's unmistakably *you*, not portfolio-speak. Options: a hobby breakdown, a "things I'm learning" list, a favorite dev/design tool ranking, a small personal ritual or story, a "currently building" note. **Tell me what you want here and I'll draft copy for it** — for now the spec reserves the slot and treats it as text+small illustration, same card format as About.

### Contact Card
- Email (mailto link)
- LinkedIn / GitHub
- Optional: "open to" line (internships, freelance, full-time — whatever's true for you)

---

## 4. The Laptop — Core New Interaction

This is the centerpiece feature replacing Shruti's flat project cards.

**States:**
1. **Closed (default):** A laptop illustration sits on the canvas as a draggable object, same as any other card — visitor can pick it up and move it anywhere.
2. **Click to open:** Clicking the laptop plays a lid-opening animation (rotate/scale the lid, or crossfade to an "open" illustration state). Screen turns on.
3. **Open state:** The laptop's screen becomes a mini-viewport showing your project gallery — think of it as a small "device frame" with a scrollable/swipeable set of 1–3 project entries inside it (thumbnail, title, one-line description, link to case study or live project).
4. **Still draggable while open:** The whole laptop (with its open screen) can still be dragged around the canvas — the project browser travels with it.
5. **Close:** A close affordance (click the lid area again, or an X on the screen) plays the animation in reverse.

**Each project entry inside the laptop screen should have:**
- Project name
- 1-line description
- Role/what you did (design, dev, or both)
- Tech/tools used
- Link out (live site / GitHub / case study) or a "view case study" that could later expand into its own card

*Send me your 1–3 projects (name, what it is, your role, links) and I'll write the actual copy for each screen.*

---

## 5. Interaction & Animation Behavior

- **Camera pan, not page scroll:** mousedown+drag (or touch) on empty canvas pans the whole scene; scroll wheel could also pan rather than zoom, matching the reference's "fixed scroll" feel
- **Object drag:** each card/illustration/the laptop is independently draggable, with inertia (a bit of "throw and settle" physics) — this is what GSAP Draggable + a physics/inertia plugin gives you, or Lenis is more for smooth camera-scroll, GSAP Draggable is for object-drag
- **Z-index bring-to-front on grab:** whatever object you're dragging pops above the others
- **First-load hint:** the "drag to explore" text fades after the first successful drag
- **Laptop open/close:** a distinct, satisfying animation (200–400ms, ease-out) — this is the "wow" moment of the site, worth extra polish time
- **Mobile:** swipe-to-pan the canvas; tap to open laptop; consider a simplified/stacked layout on very small screens if free-drag feels cramped

---

## 6. Recommended Tech Stack for Antigravity

Given the drag-canvas + physics feel, and that Shruti's own site used this combo:

- **HTML/CSS/JS** (vanilla, or React if you're more comfortable there — either works fine for this pattern)
- **GSAP** + **GSAP Draggable plugin** — for object dragging, inertia, and the laptop open/close animation
- **Lenis** — optional, mainly useful if you want any inertial smoothing on the camera pan itself
- No CMS needed at this scale (1-3 projects) — hardcode content as structured JS objects/JSON so it's easy for you (or later, Antigravity) to update without touching layout code

Suggested file structure to ask Antigravity for:
```
/index.html
/styles/main.css
/scripts/canvas.js      → pan/drag logic for the whole canvas
/scripts/draggable.js   → per-object drag behavior
/scripts/laptop.js      → open/close animation + project gallery logic
/data/projects.js       → your 1-3 projects as data
/assets/                → illustrations, icons, photos
```

---

## 7. What I Still Need From You

To turn this spec into final copy + starter code:
1. Your actual skills/tools list (left dock + skills card)
2. Content for the "fun" personal card
3. Your 1–3 projects: name, description, your role, tech used, link
4. Visual direction: color palette / mood (sketchbook-warm like the reference, or something else — dark/technical, minimal, etc.)
5. Preferred stack confirmation: vanilla JS or React

Once I have these, I can either write the full copy for each card, or generate a working starter prototype (HTML/CSS/JS with the drag-canvas + laptop interaction wired up) for you to bring into Antigravity.