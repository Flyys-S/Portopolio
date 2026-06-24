# Project Directory Structure

This document outlines the folder structure of the Portopolio project, the purpose of each directory, and details of key files.

## Root Directory

*   **`Docs/`**: Project documentation, session logs (`day_1.md`, `day_2.md`, `day_3.md`), and directory layouts.
*   **`public/`**: Static assets served directly by Vite (e.g., icons, logos).
*   **`src/`**: Main application source code.

---

## Src Directory (`/src`)

*   **`assets/`**: Media files, global icons, and static assets imported directly into components.
*   **`components/`**: Reusable and animated UI components.
    *   `FullMenu.tsx` & `FullMenu.css`: Full-screen grid overlay menu system with direction-aware marquee hovers.
    *   `TextPressure.tsx`: Font-width variation animation text component.
    *   `TextType.tsx`: Typing character sequence animation component.
*   **`pages/`**: Co-located page-level components containing view logic and local styles:
    *   `LandingPage/`: Main splash page (`LandingPage.tsx` and `LandingPage.css`) housing 3D Spline backgrounds.
    *   `ProjectsPage/`: Accordion-based work showcase page (`ProjectsPage.tsx` and `ProjectsPage.css`).
*   **`service/`**: API, firebase, or mock data client connections.
*   **`utils/`**: Shared helper utility scripts:
    *   `transition.ts`: Holds page transitions (`playPageTransition`).
    *   `helpers.ts`: Holds math helpers, debounce utilities, and layout properties.
