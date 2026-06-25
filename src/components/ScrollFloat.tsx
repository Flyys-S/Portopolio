import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
  animationDuration?: number;
  ease?: string;
  stagger?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollFloat({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  stagger = 0.03,
  containerRef
}: ScrollFloatProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const scrollContainer = containerRef.current;
    if (!textEl || !scrollContainer) return;

    // Split text into characters
    const chars = textEl.innerText.split('');
    textEl.innerHTML = ''; // Clear original text
    
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char; // Preserve spaces
      span.style.display = 'inline-block';
      span.style.transformOrigin = 'bottom center';
      span.style.willChange = 'transform, opacity';
      textEl.appendChild(span);
    });

    const spans = textEl.querySelectorAll('span');

    // Create GSAP ScrollTrigger animation bound to the horizontal scroll of containerRef
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textEl,
        scroller: scrollContainer,
        horizontal: true, // Use horizontal scroll triggering matching our layout
        start: 'left left', // Start when the text element's left edge is at container's left
        end: 'right left+=200px', // End slightly after the text scrolls out
        scrub: 1 // Smooth scrub binding
      }
    });

    tl.fromTo(
      spans,
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1
      },
      {
        y: -100,
        opacity: 0,
        rotate: 15,
        scale: 0.8,
        stagger: stagger,
        duration: animationDuration,
        ease: ease
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [children, animationDuration, ease, stagger, containerRef]);

  return (
    <div ref={textRef} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
    </div>
  );
}
