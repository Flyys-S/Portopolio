import { useState, useEffect, useRef } from "react";
import TextPressure from "../../components/TextPressure";
import TextType from "../../components/TextType";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import { playPageTransition } from "../../utils/transition";
import './LandingPage.css';

export default function LandingPage() {
    const splineSceneUrl = "https://prod.spline.design/BKpZ15L0be5l2Ade/scene.splinecode";
    const layersRef = useRef<HTMLDivElement>(null);
    const isBusy = useRef(false);
    
    // Initialize state from URL hash
    const [currentView, setCurrentView] = useState<'home' | 'project'>(() => {
        return window.location.hash === '#project' ? 'project' : 'home';
    });

    // Listen to hash changes (for back/forward browser navigation)
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentView(window.location.hash === '#project' ? 'project' : 'home');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = (view: 'home' | 'project') => {
        if (isBusy.current || currentView === view) return;
        isBusy.current = true;

        playPageTransition(
            layersRef.current,
            view === 'project',
            () => {
                setCurrentView(view);
                window.location.hash = view === 'project' ? 'project' : 'home';
            },
            () => {
                isBusy.current = false;
            }
        );
    };

    return (
        <>
            {/* Staggered Transition Overlay */}
            <div ref={layersRef} className="transition-overlay">
                <div className="transition-layer" style={{ background: '#1a1a1a', zIndex: 10 }} />
                <div className="transition-layer" style={{ background: '#222222', zIndex: 9 }} />
                <div className="transition-layer" style={{ background: '#ff5e3a', zIndex: 8 }} />
            </div>
            <div className="spline-wrapper">
                {/* @ts-expect-error spline-viewer is a custom web component not defined in standard React types */}
                <spline-viewer url={splineSceneUrl}></spline-viewer>
            </div>

            {currentView === 'home' ? (
                <div className="app-layout">
                    <header className="header-brand interactive" style={{ width: 'fit-content' }}>
                        <TextType
                            text={["Full Stack Developer", "AI Engineer"]}
                            as="span"
                            className="subtitle"
                            typingSpeed={60}
                            deletingSpeed={40}
                            pauseDuration={1500}
                            loop={true}
                        />
                        <div style={{ height: '90px', width: '800px', maxWidth: '90vw' }}>
                            <TextPressure
                                text="RAFLY RAJWA SYAHPUTRA"
                                fontFamily="var(--font-serif)"
                                textColor="#FFFFFF"
                                minFontSize={56}
                            />
                        </div>
                    </header>
                    <main className="main-content">
                        <nav className="interactive">
                            <ul className="nav-menu">
                                <li><a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
                                <li><a href="#project" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('project'); }}>Project</a></li>
                                <li><a href="#about" className="nav-link">About</a></li>
                                <li><a href="#contact" className="nav-link">Contact</a></li>
                            </ul>
                        </nav>
                    </main>
                    <footer className="interactive">
                        <div className="footer-socials">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">Instagram</a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link">GitHub</a>
                        </div>
                    </footer>
                </div>
            ) : (
                <ProjectsPage onBack={() => navigateTo('home')} />
            )}
        </>
    );
}
