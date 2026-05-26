# System Design — Portfolio

> Complete architecture, component hierarchy, animation pipeline, CSS strategy, data flow, and rendering model for Divyansh's developer portfolio.

---

## Table of Contents
- [1. Architecture Overview](#1-architecture-overview)
- [2. Component Hierarchy](#2-component-hierarchy)
- [3. File Structure](#3-file-structure)
- [4. Data Architecture](#4-data-architecture)
- [5. CSS Architecture](#5-css-architecture)
- [6. Animation Pipeline](#6-animation-pipeline)
- [7. Custom Hooks](#7-custom-hooks)
- [8. Rendering & Performance](#8-rendering--performance)
- [9. Navigation System](#9-navigation-system)
- [10. Responsive Design Strategy](#10-responsive-design-strategy)
- [11. 3D Layer (Three.js)](#11-3d-layer-threejs)
- [12. Accessibility](#12-accessibility)
- [13. Build & Deployment](#13-build--deployment)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
├──────────────────────────────────────────────────────────┤
│  index.html                                              │
│  └─ <div id="root">                                      │
│     └─ main.tsx (React entry)                            │
│        └─ <App />                                        │
│           ├─ Preloader          (z: 9999)                │
│           ├─ Toast Notification (z: 9000)                │
│           ├─ Navbar             (z: 100, fixed)          │
│           ├─ Hero Section       (z: 10)                  │
│           ├─ Marquee            (z: 10)                  │
│           ├─ About              (z: 10)                  │
│           ├─ Capabilities       (z: 10)                  │
│           ├─ Credentials        (z: 10)                  │
│           ├─ Selected Work      (z: 10)                  │
│           ├─ Journey            (z: 10)                  │
│           ├─ Philosophy         (z: 10)                  │
│           ├─ Contact            (z: 10)                  │
│           └─ Footer             (z: 10)                  │
├──────────────────────────────────────────────────────────┤
│  CSS Layers (via ::before / ::after on body)             │
│  ├─ Film Grain Overlay   (z: 9998, pointer-events: none) │
│  └─ Vignette Gradient    (z: 0, pointer-events: none)    │
└──────────────────────────────────────────────────────────┘
```

**Design Philosophy:**
- Single-page application (SPA) with no client-side routing
- All sections are rendered in a single vertical scroll
- Scroll-driven reveals handle progressive content exposure
- Zero external UI libraries — all styles are custom CSS
- Data is co-located in `App.tsx` (primary) and `data/content.ts` (secondary)

---

## 2. Component Hierarchy

```
<React.StrictMode>
└── <App>                              ← Main orchestrator (App.tsx)
    ├── Preloader                      ← Inline, counter animation
    ├── Toast                          ← Inline, notification popups
    ├── <nav>                          ← Inline, scroll-aware navbar
    ├── <Hero>                         ← Inline section
    │   └── <Typewriter>               ← Custom typing animation
    ├── <MarqueeSection>               ← Infinite scroll tech banner
    ├── <AboutSection>                 ← Bio + details + skill tags
    │   └── <Typewriter>
    ├── <CapabilitiesSection>          ← 4 capability cards
    ├── <CertificatesSection>          ← Credential cards with links
    ├── <ProjectsSection>              ← Horizontal scroll project cards
    │   └── <Typewriter> (per card)
    ├── <JourneySection>               ← Timeline component
    │   └── <Typewriter> (per entry)
    ├── <PhilosophySection>            ← Single animated quote
    │   └── <Typewriter>
    ├── <ContactSection>               ← WhatsApp CTA + socials
    └── <footer>                       ← Copyright line

External Components (src/components/):
├── sections/
│   ├── Hero.tsx + Hero.css            ← Alternative hero (unused in main)
│   ├── About.tsx + About.css
│   ├── Projects.tsx + Projects.css    ← Standalone project grid
│   ├── Skills.tsx + Skills.css
│   ├── Experience.tsx + Experience.css
│   ├── Contact.tsx + Contact.css
│   └── TechShowcase.tsx + TechShowcase.css
├── ui/
│   ├── Navbar.tsx + Navbar.css
│   ├── CustomCursor.tsx + CustomCursor.css
│   ├── MagneticButton.tsx + MagneticButton.css
│   ├── Preloader.tsx + Preloader.css
│   ├── ScrollProgress.tsx + ScrollProgress.css
│   └── SocialSidebar.tsx + SocialSidebar.css
└── canvas/
    ├── Scene.tsx                      ← R3F Canvas wrapper
    ├── ParticleField.tsx              ← Animated particle system
    ├── FloatingGeometry.tsx           ← Rotating 3D shapes
    ├── Constellation.tsx              ← Interactive node network
    └── TechSphere.tsx                 ← Rotating tech label sphere
```

> **Note:** The main `App.tsx` uses inline section components (defined at the bottom of the file) as the primary rendering path. The `src/components/sections/` directory contains standalone alternatives used for modular development and potential future refactoring.

---

## 3. File Structure

```
portfolio/                             ~95KB source (excluding node_modules)
├── public/
│   ├── certificates/                  # Credential documents
│   │   ├── walmart-swe.pdf
│   │   ├── deloitte-data-analytics.pdf
│   │   ├── deloitte-cyber-security.pdf
│   │   ├── deloitte-technology.pdf
│   │   └── guvi-git.jpg
│   ├── images/                        # Project screenshots (future)
│   ├── models/                        # 3D models (if used)
│   ├── textures/                      # 3D textures (if used)
│   ├── favicon.svg                    # 9.5KB SVG favicon
│   ├── icons.svg                      # 5KB SVG sprite sheet
│   └── resume.pdf                     # 710KB downloadable CV
│
├── src/
│   ├── App.tsx                        # 25KB — Primary application file
│   ├── main.tsx                       # 243B — React DOM entry point
│   │
│   ├── styles/
│   │   ├── design-system.css          # 3.5KB — CSS custom properties
│   │   ├── global.css                 # 4.9KB — Reset, utilities, overlays
│   │   ├── bento.css                  # 33KB — Main layout + section styles
│   │   └── app.css                    # 10.5KB — Additional component styles
│   │
│   ├── data/
│   │   ├── content.ts                 # 7.4KB — Projects, skills, timeline
│   │   └── quotes.ts                  # 6.6KB — Random quote collection
│   │
│   ├── hooks/
│   │   ├── useMobileDetect.ts         # Device type detection
│   │   ├── useMousePosition.ts        # RAF-throttled mouse tracking
│   │   └── useScrollProgress.ts       # Scroll percentage + direction
│   │
│   └── components/
│       ├── canvas/                    # 5 files, ~12.6KB total
│       ├── sections/                  # 14 files (7 TSX + 7 CSS), ~35KB
│       └── ui/                        # 12 files (6 TSX + 6 CSS), ~14.7KB
│
├── index.html                         # HTML shell with font preloads
├── tsconfig.json                      # TypeScript config (react-jsx)
├── package.json                       # Dependencies
└── .gitignore                         # Standard Vite ignores
```

---

## 4. Data Architecture

The portfolio uses a **dual data layer**:

### Layer 1: `App.tsx` — Inline Constants (Primary)
These are the canonical data objects rendered by the main `App` component:

| Constant   | Type     | Purpose |
|------------|----------|---------|
| `ME`       | Object   | Name, email, social URLs, resume path |
| `PROJECTS` | Array    | 4 projects with num, name, desc, tech, github, live |
| `JOURNEY`  | Array    | 4 timeline entries with year, role, place, text |
| `SKILLS`   | Array    | 14 technology strings |

### Layer 2: `data/content.ts` — Typed Exports (Secondary)
Used by standalone components in `src/components/sections/`:

| Export          | TypeScript Interface | Purpose |
|-----------------|---------------------|---------|
| `personalInfo`  | —                   | Name, roles, bio, stats |
| `projects`      | `Project[]`         | 3 projects with extended metadata |
| `skills`        | `Skill[]`           | 4 categories with icons and colors |
| `timeline`      | `TimelineEntry[]`   | 3 entries with achievements |
| `socialLinks`   | `SocialLink[]`      | 4 links (GitHub, LinkedIn, Twitter, Instagram) |
| `navItems`      | —                   | Navigation section labels |

### Layer 3: `data/quotes.ts` — Quote Pool
A collection of engineering and design quotes displayed randomly when the user clicks the nav name while at the top of the page.

### Data Flow Diagram

```
App.tsx (inline constants)
    │
    ├──► MarqueeSection      reads: hardcoded tech stack array
    ├──► AboutSection         reads: SKILLS
    ├──► CapabilitiesSection  reads: inline caps array
    ├──► CertificatesSection  reads: inline certs array
    ├──► ProjectsSection      reads: PROJECTS
    ├──► JourneySection       reads: JOURNEY
    ├──► ContactSection       reads: ME
    └──► Navbar               reads: ME

data/content.ts
    │
    ├──► components/sections/Projects.tsx   reads: projects
    ├──► components/sections/Skills.tsx     reads: skills
    ├──► components/sections/About.tsx      reads: personalInfo
    ├──► components/sections/Hero.tsx       reads: personalInfo
    └──► components/ui/SocialSidebar.tsx    reads: socialLinks

data/quotes.ts
    │
    └──► App.tsx → handleNameClick()        reads: quotes[]
```

---

## 5. CSS Architecture

### Layered Stylesheet System

```
main.tsx
  └── imports bento.css
         └── self-contained (includes its own reset, palette, layout)

index.html
  └── preloads Google Fonts (DM Serif Display, Outfit, JetBrains Mono)
```

The CSS is organized in 4 files, but `bento.css` is the **primary stylesheet** at 33KB:

| File | Size | Scope |
|------|------|-------|
| `design-system.css` | 3.5KB | CSS custom properties (tokens only, no selectors) |
| `global.css` | 4.9KB | Reset, typography utilities, glass/gradient classes |
| `bento.css` | 33KB | **All section layouts, animations, responsive queries** |
| `app.css` | 10.5KB | Component-level styles used by standalone components |

### Design Token System (`design-system.css`)

```
Backgrounds:  --bg-void → --bg-deep → --bg-surface → --bg-elevated → --bg-glass
Accents:      --accent-primary (#e8e4dd) → --accent-dim → --accent-muted
Highlight:    --highlight (#ff6b35) — single bold color for CTAs
Text:         --text-primary → --text-secondary → --text-muted → --text-accent
Borders:      --border-subtle → --border-glass → --border-glow → --border-hover
Typography:   Space Grotesk (display) / Inter (body) / JetBrains Mono (code)
Motion:       --ease-out-expo / --ease-out-quart / --ease-spring
Z-index:      canvas(1) → content(10) → sidebar(50) → navbar(100) → cursor(200) → loader(1000)
```

### Bento CSS Color System (Overrides)

The `bento.css` file defines its own parallel palette that takes priority:

```
--bg: #111110          (charcoal)
--bg-alt: #181817
--bg-card: #1c1c1b
--text: #c8cec6        (sage)
--text-bright: #e8ede6
--accent: #8fbc8b      (muted green)
--border: #2a2a28
```

### Visual Effect Layers

```
Layer 1 (z: 0)     — Vignette: radial-gradient darkening edges
Layer 2 (z: 1)     — 3D Canvas (when active)
Layer 3 (z: 10)    — All content sections
Layer 4 (z: 100)   — Navbar (glassmorphism)
Layer 5 (z: 9998)  — Film grain: SVG noise texture at 4% opacity
Layer 6 (z: 9999)  — Preloader (removed after load)
```

---

## 6. Animation Pipeline

### Entry Animations

| Animation | Trigger | CSS Class | Effect |
|-----------|---------|-----------|--------|
| Preloader | Page load | `.preloader.done` | Counter 000→100, then fade out |
| Reveal Blur | Scroll into view | `.reveal-blur.visible` | `filter: blur(20px)` → `blur(0)` + fade in |
| Reveal Scale | Scroll into view | `.reveal-scale.visible` | `scale(0.95)` → `scale(1)` + fade in |
| Reveal Stagger | Scroll into view | `.reveal-stagger.visible > *` | Children appear sequentially via `transition-delay` |
| Typewriter | Scroll into view | Component state | Character-by-character text reveal with blinking cursor |

### Interaction Animations

| Element | Trigger | Effect |
|---------|---------|--------|
| Nav links | Hover | Underline slides in from left |
| Nav | Scroll > 50px | Background glass + blur appears, links compress to hamburger |
| Project cards | Hover | `translateY(-10px)` lift, accent glow border-top, expanded letter-spacing on title, shadow cascade |
| Capability cards | Hover | Border glow + slight background lighten |
| Certificate cards | Hover | Border-left accent color + translateX shift |
| Marquee | Continuous | `@keyframes scroll` — infinite horizontal translation |
| Hero scroll bar | Continuous | `@keyframes scrollPulse` — fill bar pulses |
| Cursor blink | Typewriter active | `@keyframes blink` — 0.75s step-end toggle |

### Animation Implementation: `useReveal` Hook

```typescript
function useReveal(threshold = 0.2) {
  // Uses IntersectionObserver
  // Triggers once (disconnect after first intersection)
  // Returns { ref, visible }
  // Threshold configurable per section
}
```

Each section wraps its content in:
```tsx
<div ref={ref} className={`reveal-blur ${visible ? 'visible' : ''}`}>
```

### Typewriter Component

```typescript
function Typewriter({ text, speed, delay, as: Component, className }) {
  // Uses useReveal() internally
  // Starts typing only when scrolled into view
  // Configurable: speed (ms per char), delay (ms before start)
  // Renders blinking cursor during typing
  // Cursor disappears after text completes
}
```

---

## 7. Custom Hooks

### `useReveal(threshold?)`
- **Purpose:** Scroll-triggered visibility detection
- **Pattern:** IntersectionObserver, one-shot (disconnects after first trigger)
- **Returns:** `{ ref: RefObject<HTMLDivElement>, visible: boolean }`
- **Used by:** Every section component for reveal animations

### `useMobileDetect()`
- **Purpose:** Responsive device classification
- **Detects:** `isMobile` (<768px), `isTablet` (768-1024px), `isDesktop` (≥1024px), `isTouchDevice`
- **Pattern:** Resize event listener with passive flag
- **Used by:** Components that need conditional rendering based on device

### `useMousePosition()`
- **Purpose:** Smooth mouse coordinate tracking
- **Pattern:** RAF-throttled to prevent excessive re-renders. Stores latest event in ref, batches updates.
- **Returns:** `{ x, y, normalizedX (-1 to 1), normalizedY (-1 to 1) }`
- **Used by:** Custom cursor, magnetic buttons, parallax effects

### `useScrollProgress()`
- **Purpose:** Global scroll position as percentage
- **Pattern:** RAF-throttled scroll listener
- **Returns:** `{ progress (0-1), direction ('up' | 'down') }`
- **Used by:** Scroll progress indicator bar

---

## 8. Rendering & Performance

### Optimization Strategies

| Strategy | Implementation |
|----------|---------------|
| One-shot observers | `useReveal` disconnects after first trigger — no ongoing observation cost |
| RAF batching | Mouse and scroll hooks use `requestAnimationFrame` to batch state updates |
| CSS-driven animation | All hover/transition effects are pure CSS — no JS animation loops |
| Passive listeners | All scroll/resize/mousemove events use `{ passive: true }` |
| Lazy typing | Typewriter components only start their interval when scrolled into view |
| Font preloading | Google Fonts loaded via `<link rel="preconnect">` in `index.html` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` zeroes all animation durations |
| Touch fallback | `@media (hover: none)` disables cursor: none and hover-dependent effects |

### Bundle Strategy

```
Vite 8 (ESBuild + Rollup)
├── React 19 (react, react-dom)
├── Three.js + R3F (tree-shaken, loaded for 3D canvas components)
└── Zero CSS framework — all vanilla CSS
```

### Critical Render Path

```
1. index.html loads
2. Vite injects <script type="module" src="/src/main.tsx">
3. main.tsx renders <App /> inside React.StrictMode
4. App mounts → Preloader visible (z: 9999)
5. Counter animates 000 → 100 over 2000ms
6. Preloader fades out (opacity transition 800ms)
7. Sections render but hidden (reveal-blur/scale initial state)
8. User scrolls → IntersectionObserver triggers → sections animate in
9. Typewriter begins character reveal per section
```

---

## 9. Navigation System

### Scroll-Aware Navbar

```
State: scrolled (boolean) — true when window.scrollY > 50

When NOT scrolled (top of page):
┌─────────────────────────────────────────────┐
│  Divyansh   Home About Capabilities ...  Resume │
└─────────────────────────────────────────────┘

When scrolled:
┌─────────────────────────────────────────────┐
│  Divyansh                           ☰  Resume │
│                              (hamburger menu) │
└─────────────────────────────────────────────┘

Mobile (always):
┌─────────────────────────────────────────────┐
│  Divyansh                           ☰  Resume │
└─────────────────────────────────────────────┘
```

### Smart Navigation Logic (`handleNavClick`)

```
1. User clicks a nav link (e.g., "About")
2. Prevent default anchor behavior
3. Close mobile menu if open
4. Find target element by ID
5. Check if user is ALREADY at that section:
   ├── If within 200px of section top → Show toast "You're already exploring this section"
   └── Special case: #contact checks if user is near page bottom
6. If not already there → scrollIntoView({ behavior: 'smooth' })
```

### Name Click Easter Egg (`handleNameClick`)

```
1. User clicks "Divyansh" in navbar
2. If scrollY > 50% of viewport → Scroll to top
3. If already at top → Show random quote from quotes.ts in toast
```

### Toast Notification System

```
triggerToast(message: ReactNode, duration?: number)
├── Sets toast content (supports JSX with styled spans)
├── Shows toast with CSS transition
└── Auto-hides after duration (default: 3000ms)
```

---

## 10. Responsive Design Strategy

### Breakpoint System

| Breakpoint | Target | Key Changes |
|------------|--------|-------------|
| `≤ 480px` | Small phones | Single column, reduced padding, smaller type |
| `≤ 600px` | Large phones | Hero title size reduction, stacked layouts |
| `≤ 768px` | Tablets (portrait) | Hamburger menu always visible, 2-col grids → 1-col |
| `≤ 900px` | Tablets (landscape) | Project cards width adjustment |
| `≤ 1024px` | Small laptops | Navbar compresses to hamburger |
| `≤ 1200px` | Standard laptops | Slight padding reductions |
| `≥ 1200px` | Desktop | Full layout, all effects active |

### Responsive Patterns

```css
/* Typography scales with clamp() */
font-size: clamp(2rem, 6vw, 5rem);     /* Hero title */
font-size: clamp(0.85rem, 1.2vw, 1rem); /* Body text */

/* Spacing scales with clamp() */
padding: clamp(80px, 12vh, 160px);      /* Section padding */
gap: clamp(20px, 4vw, 80px);           /* Grid gutters */

/* Grid adapts */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
```

### Touch Device Handling

```css
@media (hover: none) and (pointer: coarse) {
  body { cursor: auto; }        /* Disable custom cursor */
  button { cursor: pointer; }   /* Restore system cursor */
  /* All :hover effects remain but don't interfere with touch */
}
```

---

## 11. 3D Layer (Three.js)

The portfolio includes an optional 3D rendering layer built with React Three Fiber:

### Components

| Component | Description | Geometry |
|-----------|-------------|----------|
| `Scene.tsx` | Canvas wrapper with camera, lighting, controls | — |
| `ParticleField.tsx` | Floating particles with subtle drift | `BufferGeometry` points |
| `FloatingGeometry.tsx` | Rotating wireframe shapes | Icosahedron, Torus, Octahedron |
| `Constellation.tsx` | Interactive node network | Lines + Spheres |
| `TechSphere.tsx` | Rotating sphere of tech labels | `Billboard` + `Text` |

### Integration

```tsx
// Scene wraps all 3D content in a fixed canvas
<div className="canvas-container">  {/* position: fixed, z-index: 1 */}
  <Canvas>
    <Scene />
  </Canvas>
</div>
```

> **Current status:** 3D components exist in the codebase but the main `App.tsx` uses CSS-based grain/gradient backgrounds instead. The 3D layer is available for future use or as an opt-in feature.

---

## 12. Accessibility

| Feature | Implementation |
|---------|---------------|
| Reduced motion | `@media (prefers-reduced-motion: reduce)` zeroes all transition/animation durations |
| Semantic HTML | `<nav>`, `<section>`, `<footer>`, `<aside>` with proper hierarchy |
| ARIA labels | Social links have `aria-label` attributes |
| Color contrast | High-contrast text (#c8cec6 on #111110 = 8.5:1 ratio) |
| Focus indicators | Default browser focus styles preserved (no `outline: none` on interactive elements) |
| Touch support | Custom cursor disabled on touch devices via media query |
| Selection styling | Custom `::selection` with accent color |
| Scrollbar | Custom thin scrollbar styling that falls back gracefully |

---

## 13. Build & Deployment

### Build Pipeline

```
Source (TypeScript + CSS)
    │
    ▼
Vite 8 Dev Server (HMR)
    │
    ▼
tsc (Type checking)
    │
    ▼
Vite Build (ESBuild transform → Rollup bundle)
    │
    ▼
dist/
├── index.html           (injected script/style references)
├── assets/
│   ├── index-[hash].js  (bundled JS)
│   └── index-[hash].css (bundled CSS)
├── certificates/        (copied from public/)
├── resume.pdf           (copied from public/)
└── favicon.svg          (copied from public/)
```

### Deployment Target

```
Platform:    Vercel
Build Cmd:   npm run build (tsc && vite build)
Output Dir:  dist
Node:        18+
Framework:   Vite (auto-detected)
```

### Environment

No environment variables are required. The portfolio is a fully static site with no backend, no API calls, and no secrets. All data is bundled at build time.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Inline sections in `App.tsx` | Keeps all content visible in one file for rapid iteration. Trade-off: large file (~25KB) |
| Dual data layer | `App.tsx` constants for fast prototyping, `data/content.ts` for type-safe component use |
| No CSS framework | Full control over design tokens, animations, and responsive behavior |
| CSS-first animations | GPU-accelerated transforms/opacity. No JS animation runtime overhead |
| One-shot IntersectionObserver | Sections only need to reveal once. Disconnect prevents memory leaks |
| RAF-throttled hooks | Prevents layout thrashing from high-frequency events (mouse, scroll) |
| WhatsApp CTA over email form | Higher conversion rate, pre-filled message captures intent and contact details |
| Static site (no SSR) | Portfolio content doesn't change per-request. Static build = fastest TTFB |

---

*Last updated: May 2026*
