# RRS — Personal Portfolio website

A premium, highly interactive personal portfolio website designed for digital developers and creators. Built with high-performance animations, direction-aware overlays, and interactive 3D elements.

## 🚀 Key Features

*   **3D Spline Interactive Scene**: High-performance interactive background scene at the core of the landing page.
*   **Grid Menu System Overlay**: A full-screen overlay grid menu featuring 5 vertical columns, dynamic local time clock, and clean typography.
*   **Direction-Aware Flowing Menu**: Interactive hover animations inside menu rows that slide marquee titles (`GET TO KNOW ME`, `CREATIVE WORK`, `GET IN TOUCH`) in/out depending on cursor coordinates.
*   **Horizontal Project Accordion Layout**: Accordion-based column showcases on the Projects page. Expanding a column reveals detail summaries, checklists, and visual project previews with fluid cubic-bezier transitions.
*   **Directional Page Transitions**: Layered panel sweep transitions that shift dynamically from right-to-left or left-to-right depending on spatial navigation direction.
*   **Full URL Hash Syncing**: Page states map directly to `#home`, `#project`, `#about`, and `#contact` hashes to support native browser forward/back buttons.

---

## 🛠️ Technology Stack

*   **Core Framework**: React 19 + TypeScript + Vite
*   **Animation**: GSAP (GreenSock Animation Platform) + CSS Keyframes
*   **3D Integration**: Spline Viewer Runtime
*   **Styles**: Vanilla CSS

---

## 📁 Directory Structure

For a full breakdown of directories and files, please refer to [path_documentation.md](file:///c:/Users/rafly/Documents/GitHub/Portopolio/Docs/path_documentation.md).

```bash
├── Docs/                  # Project documentation & session logs
├── public/                # Static public assets
└── src/
    ├── assets/            # Global media assets & images
    ├── components/        # Reusable UI components (FullMenu, TextPressure, etc.)
    ├── pages/             # Co-located Page modules (LandingPage, ProjectsPage)
    ├── service/           # Integration clients
    └── utils/             # Reusable scripts (helpers, transition timelines)
```

---

## ⚙️ Getting Started

### 1. Installation
Install all dependencies:
```bash
npm install
```

### 2. Development Server
Start the local server with hot module replacement (HMR):
```bash
npm run dev
```

### 3. Production Build
Verify type-safety and compile the application for production:
```bash
npm run build
```

### 4. Code Quality
Run ESLint to verify codebase standards:
```bash
npm run lint
```
    