# Project Directory Structure

This document outlines the folder structure of the Portopolio project and the purpose of each directory.

## Root Directory

*   **`Docs/`**: Project documentation, guides, and architectural designs.
*   **`public/`**: Static assets that are served directly without processing by Vite (e.g., `vite.svg`, `favicon.ico`).
*   **`src/`**: The main source code of the application.

---

## Src Directory (`/src`)

*   **`assets/`**: Media files, icons, global styles, and other assets that are imported directly into the TypeScript/React components.
*   **`components/`**: Reusable, presentation-focused UI components (e.g., `Button`, `Card`, `Navbar`, `Footer`).
*   **`pages/`**: Page-level components corresponding to specific routes or views. To maintain high modularity, each page is placed in its own folder containing both the React component and its corresponding page-specific CSS stylesheet (e.g., `pages/LandingPage/LandingPage.tsx` and `pages/LandingPage/LandingPage.css`).
*   **`service/`**: External integration logic, API requests, fetchers, and service initializations (e.g., Firebase, REST clients).
*   **`utils/`**: General-purpose helper functions, validators, formatters, and custom React hooks that are shared across components. All helper/utility functions in the project must reside in this directory and be imported by components.
