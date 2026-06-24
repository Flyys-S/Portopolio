import React, { useState } from 'react';
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

export default function ProjectsPage({ onBack }: ProjectsPageProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  React.useEffect(() => {
    // Reference onBack to avoid unused variable error in strict compiler modes
    console.log('ProjectsPage mounted, onBack handler available:', !!onBack);
  }, [onBack]);

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
    <div className="projects-container interactive">
      {/* Sidebar header / Left side */}
      <div className="projects-left-panel" style={{ paddingTop: '80px' }}>
        <div className="featured-header">
          <h2 className="featured-title">FEATURED<br />WORK</h2>
          <p className="featured-desc">
            <span className="dropcap">A</span>s a developer, I like to start from a blank canvas and clean data to give life to an
            impactful web application that makes your brand stand out — starting from an
            intelligent system design that guides the project's vision into reality.
          </p>
        </div>
      </div>

      {/* Accordion / Right side */}
      <div className="projects-carousel">
        {projects.map((project) => {
          const isActive = activeProjectId === project.id;
          return (
            <div
              key={project.id}
              className={`project-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveProjectId(isActive ? null : project.id)}
              style={{ '--accent-color': project.color } as React.CSSProperties}
            >
              {/* Vertical border stripe indicator */}
              <div className="card-border-line" />

              {/* Unexpanded Column View */}
              <div className="card-collapsed-content">
                <span className="collapsed-title">
                  {project.title}
                </span>
                <span className="collapsed-year">
                  <span className="new-tag">NEW</span>{" "}
                  {project.year}
                </span>
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
        })}
      </div>
    </div>
  );
}
