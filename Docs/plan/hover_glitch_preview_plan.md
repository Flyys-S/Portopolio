# Hover Page Preview with Glitch Transition Plan

Implement an interactive navigation system where hovering over menu links displays page previews in the background with a high-end visual glitch transition effect (inspired by `thibaultguignand.com`). Clicking locks the selected page into a full view.

## Concept Overview
*   **Transition Effect**: A CRT scanline and flickering RGB shift animation (CSS-based glitch) that fires on hover-state change.
*   **Background Interaction**: When no menu link is hovered, the screen reverts smoothly to the 3D Spline scene.
*   **Preview Panels**: Dark-mode glassmorphism panels to blend with the Spline canvas.

## Proposed Components & Page Structure

### 1. Stylesheets (`src/App.css`)
*   Add keyframe animations for CRT flicker, chromatic aberration translation, and scanline animations.
*   Create styles for `.glitch-overlay` that triggers a brief animation on state change.
*   Add layout styles for the preview panels and full-screen locked views.

### 2. Component Previews (`src/components/...`)
*   **`ProjectPreview.tsx`**: A stylized list of project cards (e.g., interactive cards, tech stacks, GitHub links).
*   **`AboutPreview.tsx`**: A premium biography panel, skills timeline, and credentials layout.
*   **`ContactPreview.tsx`**: An elegant communication terminal featuring links, email COPY button, and social handles.

### 3. Main Views (`src/pages/LandingPage.tsx`)
*   Introduce `hoveredPage` and `activePage` states.
*   Hook up mouse enter/leave listeners to the navigation links.
*   Trigger the `.glitch-overlay` component class by applying a temporary animation class when `hoveredPage` changes.
*   Conditionally render the preview/locked page components behind the UI overlay.
