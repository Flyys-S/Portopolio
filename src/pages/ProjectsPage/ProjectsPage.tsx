import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollFloat from '../../components/ScrollFloat';
import './ProjectsPage.css';

interface Project {
  id: string;
  title: string;
  year: string;
  shortDesc: string;
  descriptions: string[];
  image: string;
  color: string;
}

interface ProjectsPageProps {
  onBack: () => void;
}

const findClosestEdge4Way = (
  mouseX: number,
  mouseY: number,
  width: number,
  height: number
): 'top' | 'bottom' | 'left' | 'right' => {
  const t = mouseY;
  const b = height - mouseY;
  const l = mouseX;
  const r = width - mouseX;
  const min = Math.min(t, b, l, r);
  if (min === l) return 'left';
  if (min === r) return 'right';
  if (min === t) return 'top';
  return 'bottom';
};

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ProjectCard({ project, isActive, onClick, containerRef }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);
  const orangeInnerRef = useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: 'expo.out' };

  React.useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const anim = gsap.fromTo(
      card,
      {
        x: 100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: card,
          scroller: container,
          horizontal: true,
          start: 'left right-=80px',
          end: 'left center+=100px',
          scrub: 1
        }
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [containerRef]);

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!collapsedRef.current || !orangeRef.current || !orangeInnerRef.current) return;
    const rect = collapsedRef.current.getBoundingClientRect();
    const edge = findClosestEdge4Way(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    let startX = '0%';
    let startY = '0%';
    let innerStartX = '0%';
    let innerStartY = '0%';

    if (edge === 'left') {
      startX = '-101%';
      innerStartX = '101%';
    } else if (edge === 'right') {
      startX = '101%';
      innerStartX = '-101%';
    } else if (edge === 'top') {
      startY = '-101%';
      innerStartY = '101%';
    } else if (edge === 'bottom') {
      startY = '101%';
      innerStartY = '-101%';
    }

    gsap.timeline({ defaults: animationDefaults })
      .set(orangeRef.current, { x: startX, y: startY }, 0)
      .set(orangeInnerRef.current, { x: innerStartX, y: innerStartY }, 0)
      .to([orangeRef.current, orangeInnerRef.current], { x: '0%', y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!collapsedRef.current || !orangeRef.current || !orangeInnerRef.current) return;
    const rect = collapsedRef.current.getBoundingClientRect();
    const edge = findClosestEdge4Way(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    let endX = '0%';
    let endY = '0%';
    let innerEndX = '0%';
    let innerEndY = '0%';

    if (edge === 'left') {
      endX = '-101%';
      innerEndX = '101%';
    } else if (edge === 'right') {
      endX = '101%';
      innerEndX = '-101%';
    } else if (edge === 'top') {
      endY = '-101%';
      innerEndY = '101%';
    } else if (edge === 'bottom') {
      endY = '101%';
      innerEndY = '-101%';
    }

    gsap.timeline({ defaults: animationDefaults })
      .to(orangeRef.current, { x: endX, y: endY }, 0)
      .to(orangeInnerRef.current, { x: innerEndX, y: innerEndY }, 0);
  };

  return (
    <div
      className={`project-card ${isActive ? 'active' : ''}`}
      ref={cardRef}
      style={{ '--accent-color': project.color } as React.CSSProperties}
    >
      {/* Vertical border stripe indicator */}
      <div className="card-border-line" />

      {/* Unexpanded Column View (acting as hover trigger and item click) */}
      <div
        className="card-collapsed-content"
        ref={collapsedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <span className="collapsed-title">
          {project.title}
        </span>
        <span className="collapsed-year">
          <span className="new-tag">NEW</span>{" "}
          {project.year}
        </span>

        {/* Sliding Orange Overlay inside the 140px strip */}
        <div className="card-orange-overlay" ref={orangeRef}>
          <div className="card-orange-inner" ref={orangeInnerRef}>
            <div className="card-orange-bg" />
          </div>
        </div>
      </div>

      {/* Expanded Horizontal View */}
      <div className="card-expanded-content">
        <div className="expanded-text-wrapper">
          <h3 className="project-title">{project.title}</h3>
          <div className="project-desc-list">
            {project.descriptions.map((desc, i) => (
              <p key={i} className="project-desc-item">{desc}</p>
            ))}
          </div>
        </div>

        <div className="project-preview-box">
          {project.image ? (
            <img src={project.image} alt={project.title} className="project-image" />
          ) : (
            <div className="project-image-placeholder" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage({ onBack }: ProjectsPageProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log('ProjectsPage mounted, onBack handler available:', !!onBack);
  }, [onBack]);

  const handleCardClick = (id: string, idx: number) => {
    const isOpening = activeProjectId !== id;
    setActiveProjectId(isOpening ? id : null);

    if (isOpening && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          const cards = containerRef.current.querySelectorAll('.project-card');
          const clickedCard = cards[idx] as HTMLElement;
          if (clickedCard) {
            const targetScroll = clickedCard.offsetLeft - 32;
            containerRef.current.scrollTo({
              left: targetScroll,
              behavior: 'smooth'
            });
          }
        }
      }, 150);
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScroll = container.scrollLeft;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        const maxScroll = container.scrollWidth - container.clientWidth;
        // e.deltaY * 1.2 multiplies delta for responsive scrolling speed
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY * 1.2));

        gsap.to(container, {
          scrollLeft: targetScroll,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const handleScroll = () => {
      // Sync target scroll position if user scrolls container via other means (drag/auto-scroll)
      targetScroll = container.scrollLeft;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      gsap.killTweensOf(container);
    };
  }, []);

  const projects: Project[] = [
    {
      id: 'proj-1',
      title: 'CREATIVE HUB',
      year: '2026',
      shortDesc: 'Next-gen collaborative platform for digital creators.',
      descriptions: [
        'A sleek collaborative workspace designed for designers, developers, and writers.',
        'Built with real-time editing, live canvas sharing, and automated asset pipeline exports.',
        'Leveraging cutting-edge WebGL transitions and real-time state synchronization.'
      ],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      color: '#e25f8b'
    },
    {
      id: 'proj-2',
      title: 'SYNAPSE AI',
      year: '2026',
      shortDesc: 'Autonomous multi-agent orchestration database.',
      descriptions: [
        'A local-first intelligence platform running deep learning models for productivity.',
        'Optimized for zero-latency semantic search and contextual reasoning structures.',
        'Empowering developers with intuitive drag-and-drop neural network flowcharts.'
      ],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop',
      color: '#b05fe2'
    },
    {
      id: 'proj-3',
      title: 'AETHER SPACE',
      year: '2025',
      shortDesc: 'Immersive 3D interactive web audio experience.',
      descriptions: [
        'A spatial audio journey visualizing sound waves as procedural interactive geometry.',
        'Designed in collaboration with ambient audio engineers and modular synthesizers.',
        'Runs fully on custom shaders and Web Audio API node maps.'
      ],
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop',
      color: '#5f8be2'
    },
    {
      id: 'proj-4',
      title: 'CHRONOS PROTOCOL',
      year: '2025',
      shortDesc: 'Decentralized time-locked state ledger.',
      descriptions: [
        'A cryptographic ledger enabling future-dated smart contracts and data locks.',
        'High-performance zero-knowledge verification processes.',
        'Delivering military-grade security with an ultra-clean developer dashboard.'
      ],
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
      color: '#5fe2b0'
    },
    {
      id: 'proj-5',
      title: 'NEXUS VECTOR',
      year: '2024',
      shortDesc: 'Dynamic high-speed analytical data visualizer.',
      descriptions: [
        'Transforming gigabytes of streaming data into interactive graphical networks in real-time.',
        'Used by quantitative analysts to track market volatility trends.',
        'Fully responsive and GPU-accelerated utilizing HTML5 canvas layers.'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      color: '#e2b05f'
    }
  ];

  return (
    <div className="projects-container interactive" ref={containerRef}>
      {/* Sidebar header / Left side */}
      <div className="projects-left-panel" style={{ paddingTop: '80px' }}>
        <div className="featured-header">
          <h2 className="featured-title">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              stagger={0.03}
              containerRef={containerRef}
            >
              FEATURED
            </ScrollFloat>
            <br />
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              stagger={0.03}
              containerRef={containerRef}
            >
              WORK
            </ScrollFloat>
          </h2>
          <p className="featured-desc">
            As a developer, I like to start from a blank canvas and clean data to give life to an
            impactful web application that makes your brand stand out — starting from an
            intelligent system design that guides the project's vision into reality.
          </p>
        </div>
      </div>

      {projects.map((project, idx) => (
        <ProjectCard
          key={project.id}
          project={project}
          isActive={activeProjectId === project.id}
          onClick={() => handleCardClick(project.id, idx)}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
