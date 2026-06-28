import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import DecayCard from '../../components/DecayCard';
import ScrollFloatVertical from '../../components/ScrollFloatVertical';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const [timeStr, setTimeStr] = useState('00:00 AM GMT+7');

  useEffect(() => {
    // Dynamic Time Clock for Jakarta (WIB)
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const time = new Intl.DateTimeFormat('en-US', options).format(new Date());
      setTimeStr(`${time} GMT+7`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Initialize Lenis with longer duration (2.2s) for a premium "slowmo" scroll feel
    const lenis = new Lenis({
      wrapper: containerRef.current || undefined,
      content: containerRef.current || undefined,
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Custom GSAP ticker for Lenis smooth animations
    const tickHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    // Mouse move parallax effect on the background hero text
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroTextRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX - window.innerWidth / 2) * 0.03;
      const yPos = (clientY - window.innerHeight / 2) * 0.03;
      
      gsap.to(heroTextRef.current, {
        x: xPos,
        y: yPos,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP Scroll animations
    const ctx = gsap.context(() => {
      // 1. Hero Zoom & cinematic entrance on scroll (scrub: 2 for slowmo)
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-hero-section',
          scroller: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });

      heroTl.to('.about-hero-title', {
        scale: 0.6,
        opacity: 0,
        y: -100,
        ease: 'none',
      }, 0);

      heroTl.fromTo(portraitWrapperRef.current, 
        { scale: 0.8, y: 100, opacity: 1, rotation: -2 },
        { scale: 0.9, y: -150, opacity: 0, rotation: 0, ease: 'none' },
        0
      );

      // 2. Background color morphing driven by scroll progress through the scrollytelling section (ends back on dark)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.about-scrollytelling-section',
          scroller: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 2,
        }
      })
      .to('.about-page-container', { backgroundColor: '#ff5e00', color: '#0b0b0b', ease: 'none' })
      .to('.about-page-container', { backgroundColor: '#0b0b0b', color: '#ffffff', ease: 'none' });

      // 3. Section visual assets morphing on scroll for each container
      const stepContainers = gsap.utils.toArray('.scrollytelling-step-container');
      stepContainers.forEach((step: any) => {
        const card = step.querySelector('.visual-card-wrapper');
        const orb1 = step.querySelector('.scrollytelling-orb-1');
        const orb2 = step.querySelector('.scrollytelling-orb-2');
        
        gsap.timeline({
          scrollTrigger: {
            trigger: step,
            scroller: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          }
        })
        .to(card, { scale: 1.05, rotate: 6, y: -25, ease: 'none' }, 0)
        .to(orb1, { x: '60%', y: '40%', scale: 1.2, ease: 'none' }, 0)
        .to(orb2, { x: '-40%', y: '-30%', scale: 0.9, ease: 'none' }, 0);
      });

      // 4. Pinned Zoom transition (scrub: 2 for slowmo, zooms the text itself super large & morphs background to solid orange)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.about-transition-section',
          scroller: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        }
      })
      .to('.zoom-text', {
        scale: 1200,
        transformOrigin: '53% 50%',
        ease: 'power3.in',
        duration: 1
      }, 0)
      .to('.about-transition-section', {
        backgroundColor: '#ff5e00',
        duration: 0.1,
        ease: 'none'
      }, 0.9);

      // Hover / active scaling on Skill Rows
      const skillRows = document.querySelectorAll('.skill-row');
      skillRows.forEach((row) => {
        gsap.fromTo(row,
          { opacity: 0.6, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: row,
              scroller: containerRef.current,
              start: 'top 90%',
              end: 'top 70%',
              scrub: 2,
            }
          }
        );
      });
    }, containerRef);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      lenis.destroy();
      gsap.ticker.remove(tickHandler);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="about-page-container">
      {/* Top Header */}
      <header className="about-header">
        <div className="about-header-left">
          <span><span className="about-header-dot">●</span> JAKARTA, ID</span>
          <span>{timeStr}</span>
          <span>6.2088° S, 106.8456° E</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero-section">
        {/* Hero Header */}
        <div className="about-hero">
          <h1 ref={heroTextRef} className="about-hero-title">
            RAFLY
          </h1>
        </div>

        {/* Mid Grid Headers */}
        <div className="about-mid-headers">
          <span>Who is Rafly?</span>
          <span>Code & Craft</span>
        </div>

        {/* Portrait Section with Decay effect */}
        <div ref={portraitWrapperRef} className="about-portrait-section">
          <DecayCard 
            width={600}
            height={440}
            image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Extreme Scrollytelling Section (Static Zigzag Flow) */}
      <section className="about-scrollytelling-section">
        {/* Step 1: Image Left, Text Right */}
        <div className="scrollytelling-step-container step-align-left">
          <div className="scrollytelling-visual-side">
            <div className="scrollytelling-orb scrollytelling-orb-1"></div>
            <div className="scrollytelling-orb scrollytelling-orb-2"></div>
            <div className="visual-card-wrapper">
              <DecayCard 
                width={340}
                height={440}
                image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop"
              />
            </div>
          </div>
          <div className="scrollytelling-text-side">
            <span className="step-number">
              <ScrollFloatVertical containerRef={containerRef}>01</ScrollFloatVertical>
            </span>
            <h3>
              <ScrollFloatVertical containerRef={containerRef}>WHO I AM</ScrollFloatVertical>
            </h3>
            <p>
              <ScrollFloatVertical splitType="word" stagger={0.015} containerRef={containerRef}>
                I am Rafly Rajwa Syahputra, an AI Engineer & Full Stack Developer based in Jakarta. My journey in technology is driven by a deep curiosity to bridge artificial intelligence with stunning visual interactions.
              </ScrollFloatVertical>
            </p>
          </div>
        </div>

        {/* Step 2: Text Left, Image Right */}
        <div className="scrollytelling-step-container step-align-right">
          <div className="scrollytelling-visual-side">
            <div className="scrollytelling-orb scrollytelling-orb-1"></div>
            <div className="scrollytelling-orb scrollytelling-orb-2"></div>
            <div className="visual-card-wrapper">
              <DecayCard 
                width={340}
                height={440}
                image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop"
              />
            </div>
          </div>
          <div className="scrollytelling-text-side">
            <span className="step-number">
              <ScrollFloatVertical containerRef={containerRef}>02</ScrollFloatVertical>
            </span>
            <h3>
              <ScrollFloatVertical containerRef={containerRef}>CODE & CRAFT</ScrollFloatVertical>
            </h3>
            <p>
              <ScrollFloatVertical splitType="word" stagger={0.015} containerRef={containerRef}>
                With expertise in the React ecosystem, Machine Learning, and Generative AI, I dedicate myself to designing and building digital interfaces that are not only functional, but also tactile and intuitive. I believe that the best technology is technology that feels natural to use.
              </ScrollFloatVertical>
            </p>
          </div>
        </div>

        {/* Step 3: Image Left, Text Right */}
        <div className="scrollytelling-step-container step-align-left">
          <div className="scrollytelling-visual-side">
            <div className="scrollytelling-orb scrollytelling-orb-1"></div>
            <div className="scrollytelling-orb scrollytelling-orb-2"></div>
            <div className="visual-card-wrapper">
              <DecayCard 
                width={340}
                height={440}
                image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop"
              />
            </div>
          </div>
          <div className="scrollytelling-text-side">
            <span className="step-number">
              <ScrollFloatVertical containerRef={containerRef}>03</ScrollFloatVertical>
            </span>
            <h3>
              <ScrollFloatVertical containerRef={containerRef}>EXPLORATIONS</ScrollFloatVertical>
            </h3>
            <p>
              <ScrollFloatVertical splitType="word" stagger={0.015} containerRef={containerRef}>
                Beyond conventional web development, I dive deep into Creative Coding, Physics Shaders, and Human-Computer Interaction (HCI). I continuously experiment to create new digital experiences that are dynamic and aesthetically minded.
              </ScrollFloatVertical>
            </p>
          </div>
        </div>
      </section>

      {/* Transition Zoom-In Section */}
      <section className="about-transition-section">
        <div className="transition-zoom-container">
          <h2 className="zoom-text">WANT TO KNOW MORE?</h2>
        </div>
      </section>

      {/* Skills Section with vertical dark rows */}
      <section className="about-skills-section">
        <div className="skill-row">
          <span className="skill-text">REACT / NEXT.JS</span>
        </div>
        <div className="skill-row">
          <span className="skill-text">THREE.JS / WEBGL</span>
        </div>
        <div className="skill-row">
          <span className="skill-text">TYPESCRIPT / NODE</span>
        </div>
        <div className="skill-row">
          <span className="skill-text">AI / LLM AGENTS</span>
        </div>
      </section>

      {/* User Information Block (White Background) */}
      <section className="about-user-info-section">
        <div className="user-info-white-box">
          <h2 className="user-info-title">USER INFORMATION</h2>
          <div className="user-info-grid">
            <div className="info-grid-item">
              <h3>SYSTEM SPECS</h3>
              <p>OS: WINDOWS x64</p>
              <p>ENVIRONMENT: NEXT.JS / REACT SPA</p>
            </div>
            <div className="info-grid-item">
              <h3>STATUS</h3>
              <p>ACTIVE WORKSPACES: 1</p>
              <p>DEVELOPMENT PORT: 5173</p>
            </div>
            <div className="info-grid-item">
              <h3>GEOLOCATION</h3>
              <p>CITY: JAKARTA</p>
              <p>TIMEZONE: WIB (GMT+7)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Symmetrical Orange bottom container */}
      <div className="bottom-orange-bar"></div>

      {/* Symmetrical Bottom info footer */}
      <footer className="about-simple-footer">
        <div className="about-footer-left">
          <span>JAKARTA, ID</span>
          <span>{timeStr}</span>
          <span>6.2088° S, 106.8456° E</span>
        </div>
      </footer>
    </div>
  );
}
