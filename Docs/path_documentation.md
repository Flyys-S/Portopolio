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
*   **`pages/`**: Page-level components corresponding to specific routes or views of the application (e.g., `Home`, `About`, `Projects`, `Contact`).
*   **`service/`**: External integration logic, API requests, fetchers, and service initializations (e.g., Firebase, REST clients).
*   **`utils/`**: General-purpose helper functions, validators, formatters, and custom React hooks that are shared across components.
