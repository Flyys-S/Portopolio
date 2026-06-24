import { gsap } from "gsap";

/**
 * Triggers a staggered horizontal sliding page transition using color panels.
 * 
 * @param container The wrapper div element containing the transition layers (.transition-layer)
 * @param isForward True if moving forward (e.g. Home -> Projects), false if moving backward
 * @param onMidpoint Callback triggered at the peak of the transition (when screen is fully covered)
 * @param onComplete Callback triggered when the transition is fully finished
 */
export const playPageTransition = (
  container: HTMLDivElement | null,
  isForward: boolean,
  onMidpoint: () => void,
  onComplete?: () => void
) => {
  if (!container) {
    onMidpoint();
    if (onComplete) onComplete();
    return;
  }

  const layers = Array.from(container.querySelectorAll('.transition-layer'));
  
  // Spatial Direction Logic:
  // Forward (Home -> Project): Right-to-Left (starts at 200%/offscreen right, moves to 0%/offscreen left)
  // Backward (Project -> Home): Left-to-Right (starts at 0%/offscreen left, moves to 200%/offscreen right)
  const startX = isForward ? 200 : 0;
  const middleX = 100;
  const endX = isForward ? 0 : 200;

  // Set initial positions
  gsap.set(layers, { xPercent: startX });

  // GSAP Timeline
  const tl = gsap.timeline({
    onComplete: onComplete
  });

  // 1. Slide layers in to cover screen
  tl.to(layers, {
    xPercent: middleX,
    duration: 0.5,
    ease: "power3.inOut",
    stagger: 0.08
  });

  // 2. Execute view swap mid-transition
  tl.add(() => {
    onMidpoint();
  }, "-=0.1");

  // 3. Slide layers out to reveal new view
  tl.to(layers, {
    xPercent: endX,
    duration: 0.5,
    ease: "power3.inOut",
    stagger: 0.06
  });
};
