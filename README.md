# Portfolio

A hand-crafted developer portfolio built from scratch with React, TypeScript, and Vite. No templates, no page builders — every pixel is intentional. Features glassmorphic design, typewriter effects, CSS film grain, interactive micro-animations, and fully responsive layouts across all devices.

---

## 🚀 Live Demo
👉 [https://portfolio-of-divyansh.vercel.app/](https://portfolio-of-divyansh.vercel.app/)

---

## Features
- Cinematic preloader with animated counter
- Typewriter text reveal on scroll
- Glassmorphism cards with backdrop blur
- CSS film grain texture overlay
- Scroll-aware collapsing navbar with hamburger menu
- Interactive project cards with 3D tilt on hover
- Magnetic button effects
- Custom cursor with context-aware states
- Smooth section reveal animations (blur, scale, stagger)
- WhatsApp contact integration with pre-filled message
- Infinite tech stack marquee
- Social sidebar with hover effects
- Toast notification system
- Responsive across all devices and resolutions
- Dark-first editorial design system
- `prefers-reduced-motion` accessibility support

---

## Tech Stack
| Layer       | Technology                 |
|-------------|----------------------------|
| Framework   | React 19                   |
| Language    | TypeScript                 |
| Bundler     | Vite 8                     |
| Styling     | Vanilla CSS (Custom Design System) |
| Animations  | CSS Transitions + Keyframes |
| Deployment  | Vercel                     |

---

## Sections
| # | Section | Description |
|---|---------|-------------|
| — | Hero | Animated intro with typewriter tagline and CTA buttons |
| — | Marquee | Infinite scrolling tech stack banner |
| 01 | About | Bio, location, education, and skill tags |
| 02 | Capabilities | 4-pillar breakdown of technical strengths |
| 03 | Credentials | Downloadable certificates from Walmart, Deloitte, GUVI |
| 04 | Selected Work | Responsive grid of project cards with live/code links |
| 05 | Journey | Timeline of education and career milestones |
| — | Philosophy | Animated engineering quote |
| — | Contact | WhatsApp CTA, email copy, and social links |

---

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone https://github.com/kumar-div/my-portfolio.git
cd portfolio
npm install
```

### Run Locally
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure
```
portfolio/
├── public/
│   ├── certificates/       # PDF and image certificates
│   ├── images/             # Static image assets
│   ├── favicon.svg         # Site favicon
│   ├── icons.svg           # SVG icon sprite
│   └── resume.pdf          # Downloadable resume
├── src/
│   ├── data/               # Content data and quotes
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Design system and global CSS
│   ├── App.tsx             # Main application + section orchestration
│   └── main.tsx            # React entry point
├── index.html              # HTML shell
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── .gitignore              # Git ignore rules
```

---

## Design System
The portfolio uses a custom CSS design system (`src/styles/design-system.css`) with:

- **Color palette**: True black backgrounds, warm off-white accents, orange highlights
- **Typography**: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **Spacing**: 8-point scale from `xs` to `section`
- **Glass effects**: Configurable backdrop blur tokens
- **Motion**: Custom easing curves (expo, quart, spring) with reduced-motion fallbacks
- **Z-index**: Layered scale from canvas (1) to loader (1000)

---

## 🧠 System Design
For a complete deep-dive into architecture, component hierarchy, animation pipeline, CSS strategy, and data flow:

👉 See [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md)

---

## License
Copyright (c) 2026 Divyansh

All rights reserved.

This software and its source code are the exclusive property of the author.

Permission is granted to view and use this code for personal and educational purposes only.

You may NOT:
- Copy, reproduce, or redistribute this project or any part of it without permission
- Use this project for commercial purposes
- Sell, sublicense, or rebrand this project

Attribution Requirement:
If any part of this project is used, modified, or referenced,
proper credit MUST be given to the original author (Divyansh) with a link to the original repository.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

## 👤 Author
Built by [Divyansh](https://github.com/kumar-div)
