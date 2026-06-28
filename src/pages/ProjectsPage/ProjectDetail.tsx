import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectDetail.css';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  year: string;
  shortDesc: string;
  descriptions: string[];
  image: string;
  color: string;
  // Optional parameters from Firestore or mock fallback
  tags?: string[];
  role?: string;
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
  images?: string[]; // Extra gallery/section images
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  nextProjectTitle?: string;
}

export default function ProjectDetail({ project, onClose, onNext, nextProjectTitle }: ProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  
  // Scrollytelling active section state
  const [activeSection, setActiveSection] = useState<number>(0);

  // Fallback metadata tags if not set
  const tags = project.tags || [
    'React', 'GSAP', 'TypeScript', 'CSS Modules', 'State Orchestration'
  ];
  const role = project.role || 'Lead Frontend Developer & Interactive Animator';
  const client = project.client || 'Creative Labs Internal R&D';
  const liveUrl = project.liveUrl || 'https://google.com';
  const githubUrl = project.githubUrl || 'https://github.com';
  
  // Set of 3 images for the scrollytelling progression
  const images = project.images && project.images.length >= 3 ? project.images : [
    project.image,
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', // Tech/Abstract fallback 1
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'  // Tech/Abstract fallback 2
  ];

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const container = containerRef.current;
    const heroTitle = heroTitleRef.current;
    if (!container) return;

    // 1. Entrance animation
    const ctx = gsap.context(() => {
      // Split title characters for premium loading effect
      if (heroTitle) {
        const chars = heroTitle.querySelectorAll('.char');
        gsap.fromTo(chars,
          { y: 100, opacity: 0, rotate: 10 },
          { y: 0, opacity: 1, rotate: 0, duration: 1, stagger: 0.04, ease: 'power4.out', delay: 0.1 }
        );
      }

      // Fade-in stats cards
      gsap.fromTo('.stat-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      );

      // 2. Setup Scrollytelling ScrollTriggers
      const sections = gsap.utils.toArray('.scrolly-text-section') as HTMLElement[];
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          scroller: container,
          start: 'top center+=100',
          end: 'bottom center+=100',
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });
      });

      // Pin left side for scrollytelling if not on mobile
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        ScrollTrigger.create({
          trigger: '.scrollytelling-content',
          scroller: container,
          start: 'top top',
          end: 'bottom bottom',
          pin: '.scrollytelling-left',
          scrub: true,
        });
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [project.id]);

  // Handle next project click with a smooth out-transition
  const handleNextClick = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: onNext
    });
  };

  // Split title string into character spans for GSAP
  const renderTitleChars = (title: string) => {
    return title.split('').map((char, index) => (
      <span key={index} className="char" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div 
      className="project-detail-layout" 
      ref={containerRef} 
      style={{ '--accent-color': project.color } as React.CSSProperties}
    >
      {/* Floating Back Button */}
      <button className="detail-back-btn" onClick={onClose} aria-label="Go back">
        <span className="back-btn-arrow">←</span>
        <span className="back-btn-text">BACK TO WORK</span>
      </button>

      {/* Hero Section */}
      <section className="detail-hero-section">
        <div className="hero-grid">
          <div className="hero-header-box">
            <div className="project-year-badge">{project.year}</div>
            <h1 className="hero-title" ref={heroTitleRef}>
              {renderTitleChars(project.title)}
            </h1>
            <p className="hero-subtitle">{project.shortDesc}</p>
          </div>
          
          <div className="project-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Role</span>
              <span className="stat-value">{role}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Client</span>
              <span className="stat-value">{client}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tech Stack</span>
              <div className="stat-tags">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Scrollytelling Section */}
      <section className="scrollytelling-content">
        {/* Left Side: Pinned/Sticky Media Area */}
        <div className="scrollytelling-left" ref={leftPanelRef}>
          <div className="sticky-media-wrapper" ref={mediaContainerRef}>
            {images.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className={`media-slide ${activeSection === idx ? 'active' : ''}`}
                style={{ 
                  transform: activeSection === idx ? 'scale(1) rotate(0deg)' : activeSection > idx ? 'scale(0.9) rotate(-2deg)' : 'scale(1.1) rotate(2deg)',
                  opacity: activeSection === idx ? 1 : 0
                }}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={`${project.title} detail view ${idx + 1}`} className="media-image" />
                ) : (
                  <div className="media-placeholder" />
                )}
                <div className="media-overlay-glow" style={{ backgroundColor: project.color }} />
              </div>
            ))}
            
            {/* Visual Indicators */}
            <div className="scrollytelling-indicator">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`indicator-dot ${activeSection === idx ? 'active' : ''}`}
                  onClick={() => {
                    const sections = document.querySelectorAll('.scrolly-text-section');
                    sections[idx]?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Narrative Content */}
        <div className="scrollytelling-right">
          <div className="scrolly-text-section" id="section-0">
            <span className="section-number">01 / CONCEPT</span>
            <h2 className="section-title">The Challenge & Concept</h2>
            <div className="section-body">
              <p>{project.descriptions[0] || 'An innovative digital architecture conceived to push the boundaries of current user experience standards.'}</p>
              <p>The main objective was to craft a solution that is both highly performant and aesthetically striking, establishing a brand statement that leaves an unforgettable digital footprint.</p>
            </div>
          </div>

          <div className="scrolly-text-section" id="section-1">
            <span className="section-number">02 / ARCHITECTURE</span>
            <h2 className="section-title">Engineering & Stack Choices</h2>
            <div className="section-body">
              <p>{project.descriptions[1] || 'We integrated modern workflows to achieve seamless UI performance, utilizing client-side optimizations and low-latency storage.'}</p>
              <p>Choosing technologies wasn't just about trends, but matching the requirements for speed, flexibility, and beautiful interactive graphics without compromising layout load times.</p>
            </div>
          </div>

          <div className="scrolly-text-section" id="section-2">
            <span className="section-number">03 / RESULT</span>
            <h2 className="section-title">The Impact & Results</h2>
            <div className="section-body">
              <p>{project.descriptions[2] || 'A dynamic project that empowers users with intuitive navigation controls, GPU-accelerated graphics, and smooth state updates.'}</p>
              <p>The solution drove a noticeable increase in interactivity and engagement metrics, demonstrating the power of prioritizing visual excellence and responsive animations in design systems.</p>
            </div>

            {/* Project CTA Links */}
            <div className="project-actions">
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="action-link-btn primary">
                <span>LAUNCH SITE</span>
                <span className="btn-icon">↗</span>
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="action-link-btn secondary">
                <span>VIEW CODE</span>
                <span className="btn-icon">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Teaser Footer */}
      {onNext && nextProjectTitle && (
        <section className="next-project-teaser" onClick={handleNextClick}>
          <div className="teaser-bg-glow" style={{ backgroundColor: project.color }} />
          <div className="teaser-content">
            <span className="teaser-label">NEXT WORK</span>
            <h3 className="teaser-title">{nextProjectTitle}</h3>
            <span className="teaser-cta">
              EXPLORE CASE STUDY 
              <span className="teaser-arrow">→</span>
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
