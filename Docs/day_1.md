# Day 1 Session Documentation

Summary of all tasks and implementations completed in the Portopolio project today.

## Completed Tasks

### 1. Project Initialization & Structure
*   Cleaned and structured the root directory.
*   Structured the `src` directory with standard folders: `components`, `pages`, `service`, and `utils`.
*   Created a `Docs` directory with initial layout documentation in `path_documentation.md`.

### 2. Base UI & 3D Spline Integration
*   Created a custom responsive overlay system using Vanilla CSS. Pinned `.app-layout` using absolute positioning on top of the background canvas.
*   Configured `@splinetool/viewer` via `<spline-viewer>` in `index.html` and integrated a 3D robot character model (`https://prod.spline.design/BKpZ15L0be5l2Ade/scene.splinecode`).
*   Handled TypeScript definitions for `<spline-viewer>` JSX element type safety.

### 3. TextPressure (React Bits) Optimization
*   Created [TextPressure.tsx](file:///c:/Users/rafly/Documents/GitHub/Portopolio/src/components/TextPressure.tsx) using the variable font animation.
*   **React 19 Compatibility**: Fixed callback ref signatures to prevent compile errors.
*   **Performance Optimization**: Capped `getBoundingClientRect()` layout calculation to runs only on resize/mount, caching positions to prevent layout thrashing (stuttering) during mouse moves.
*   **Physics Tweaks**: Increased interpolation speed from `15` to `6` to make the hover effect feel highly responsive.
*   Applied the component to the main title "RAFLY RAJWA SYAHPUTRA".

### 4. TextType Typist Loop (React Bits)
*   Installed `gsap`.
*   Created [TextType.tsx](file:///c:/Users/rafly/Documents/GitHub/Portopolio/src/components/TextType.tsx) typewriter animation component.
*   Applied to the top-left subtitle to dynamically loop between **Full Stack Developer** and **AI Engineer**.

### 5. Concept & Planning for Page Previews
*   Researched the background shader displacement hover animation on `thibaultguignand.com`.
*   Created a future plan in `Docs/plan/hover_glitch_preview_plan.md` to implement state-driven hover previews with flickering chromatic aberration and CRT scanline glitch overlays.
