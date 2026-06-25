import { useState, useEffect } from "react";
import TextType from "../../components/TextType";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import AboutPage from "../AboutPage/AboutPage";
import ContactPage from "../ContactPage/ContactPage";
import FullMenu from "../../components/FullMenu";
import GlitchText from "../../components/GlitchText";
import Waves from "../../components/Waves";
import './LandingPage.css';

type PageView = 'home' | 'project' | 'about' | 'contact';

export default function LandingPage() {
    // Initialize state from URL hash
    const [currentView, setCurrentView] = useState<PageView>(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'project' || hash === 'about' || hash === 'contact') {
            return hash;
        }
        return 'home';
    });

    // Listen to hash changes (for back/forward browser navigation)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'project' || hash === 'about' || hash === 'contact') {
                setCurrentView(hash);
            } else {
                setCurrentView('home');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = (view: PageView) => {
        setCurrentView(view);
        window.location.hash = view;
    };

    const handleNavigate = (view: PageView) => {
        navigateTo(view);
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
                currentView={currentView}
            />

            {currentView === 'home' && (
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
            )}
            {currentView === 'project' && (
                <ProjectsPage onBack={() => navigateTo('home')} />
            )}
            {currentView === 'about' && (
                <AboutPage />
            )}
            {currentView === 'contact' && (
                <ContactPage />
            )}
        </>
    );
}
