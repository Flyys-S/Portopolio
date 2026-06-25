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
  _isForward: boolean,
  onMidpoint: () => void,
  onComplete?: () => void
) => {
  if (!container) {
    onMidpoint();
    if (onComplete) onComplete();
    return;
  }

  const orange = container.querySelector('.orange-panel');
  const black = container.querySelector('.black-panel');
  const orange2 = container.querySelector('.orange2-panel');

  if (!orange || !black || !orange2) {
    onMidpoint();
    if (onComplete) onComplete();
    return;
  }

  const tl = gsap.timeline({
    onComplete: onComplete
  });

  // Set initial states
  tl.set([orange, black, orange2], { clipPath: 'inset(50% 0%)' });

  // 2. Cover screen: Orange -> Black -> Orange 2
  tl.to(orange, { clipPath: 'inset(0% 0%)', duration: 0.8, ease: "power3.inOut" }, 0);
  tl.to(black, { clipPath: 'inset(0% 0%)', duration: 0.8, ease: "power3.inOut" }, 0.1);
  tl.to(orange2, { clipPath: 'inset(0% 0%)', duration: 0.8, ease: "power3.inOut" }, 0.2);

  // 3. Midpoint: Trigger React state change at 0.9s (fully covered)
  tl.add(() => {
    onMidpoint();
  }, 0.9);

  // 4. Uncover screen: Orange 2 -> Black -> Orange (starts at 1.25s to buffer render time)
  tl.to(orange2, { clipPath: 'inset(50% 0%)', duration: 0.8, ease: "power3.inOut" }, 1.25);
  tl.to(black, { clipPath: 'inset(50% 0%)', duration: 0.8, ease: "power3.inOut" }, 1.35);
  tl.to(orange, { clipPath: 'inset(50% 0%)', duration: 0.8, ease: "power3.inOut" }, 1.45);
};
