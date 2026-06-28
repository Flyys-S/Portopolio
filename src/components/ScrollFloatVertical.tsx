import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatVerticalProps {
  children: string;
  animationDuration?: number;
  stagger?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  splitType?: 'char' | 'word';
}

export default function ScrollFloatVertical({
  children,
  animationDuration = 1.2,
  stagger = 0.03,
  containerRef,
  splitType = 'char'
}: ScrollFloatVerticalProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const scrollContainer = containerRef.current;
    if (!textEl || !scrollContainer) return;

    // Split text into characters or words
    const items = splitType === 'word' ? children.split(' ') : children.split('');
    textEl.innerHTML = ''; // Clear original text
    
    items.forEach((item) => {
      const span = document.createElement('span');
      if (splitType === 'word') {
        span.innerText = item;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.35em'; // Spacing between words
      } else {
        span.innerText = item === ' ' ? '\u00A0' : item; // Preserve spaces
        span.style.display = 'inline-block';
      }
      span.style.transformOrigin = 'bottom center';
      span.style.willChange = 'transform, opacity';
      textEl.appendChild(span);
    });

    const spans = textEl.querySelectorAll('span');

    // Create GSAP ScrollTrigger animation bound to the vertical scroll of containerRef
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textEl,
        scroller: scrollContainer,
        start: 'top 90%',
        end: 'top 50%',
        scrub: 1 // Smooth scrub binding
      }
    });

    tl.fromTo(
      spans,
      {
        y: 40,
        opacity: 0,
        rotate: 4,
        scale: 0.92
      },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        stagger: stagger,
        duration: animationDuration,
        ease: 'power3.out'
      }
    );

    return () => {
      tl.kill();
    };
  }, [children, animationDuration, stagger, containerRef, splitType]);

  return (
    <div 
      ref={textRef} 
      style={{ 
        display: splitType === 'word' ? 'block' : 'inline-block', 
        whiteSpace: splitType === 'word' ? 'normal' : 'nowrap',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
}
