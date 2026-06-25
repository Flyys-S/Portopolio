import { useState, useEffect } from "react";
import TextPressure from "../../components/TextPressure";
import TextType from "../../components/TextType";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import FullMenu from "../../components/FullMenu";
import GlitchText from "../../components/GlitchText";
import Waves from "../../components/Waves";
import './LandingPage.css';

export default function LandingPage() {
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
        setCurrentView(view);
        window.location.hash = view === 'project' ? 'project' : 'home';
    };

    const handleNavigate = (view: 'home' | 'project' | 'about' | 'contact') => {
        if (view === 'home' || view === 'project') {
            navigateTo(view);
        } else {
            // For about and contact, we go to home view and scroll/hash
            navigateTo('home');
            setTimeout(() => {
                const element = document.getElementById(view);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.hash = view;
                }
            }, 500);
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Menu Toggle Button */}
            <div className="global-nav-trigger interactive">
                <button className="menu-open-btn" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                    <span className="open-btn-circle">
                        <span className="menu-btn-line line-top"></span>
                        <span className="menu-btn-line line-bottom"></span>
                    </span>
                </button>
            </div>

            <FullMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={handleNavigate} 
            />

            {currentView === 'home' ? (
                <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                    {/* Full screen Background Animation Waves */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                        <Waves
                            lineColor="rgba(255, 255, 255, 0.18)"
                            backgroundColor="transparent"
                            waveSpeedX={0.01}
                            waveSpeedY={0.005}
                            waveAmpX={30}
                            waveAmpY={15}
                            xGap={15}
                            yGap={36}
                            friction={0.925}
                            tension={0.005}
                            maxCursorMove={100}
                        />
                    </div>

                    <div className="app-layout" style={{ zIndex: 10 }}>
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
                            <div style={{ width: '100%', maxWidth: '100%', margin: '1rem 0' }}>
                                <GlitchText
                                  speed={2.5}
                                  enableShadows={true}
                                  enableOnHover={false}
                                >
                                  RAFLY RAJWA SYAHPUTRA
                                </GlitchText>
                            </div>
                            <span className="portfolio-label">Creative Web Developer & Design Portfolio ©2026</span>
                        </header>
                        <footer className="interactive">
                            <div className="footer-socials">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">Instagram</a>
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link">GitHub</a>
                            </div>
                        </footer>
                    </div>
                </div>
            ) : (
                <ProjectsPage onBack={() => navigateTo('home')} />
            )}
        </>
    );
}
