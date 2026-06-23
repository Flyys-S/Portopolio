import TextPressure from "../components/TextPressure";
import TextType from "../components/TextType";

export default function LandingPage() {
    const splineSceneUrl = "https://prod.spline.design/BKpZ15L0be5l2Ade/scene.splinecode";

    return (
        <>
            <div className="spline-wrapper">
                {/* @ts-ignore */}
                <spline-viewer url={splineSceneUrl}></spline-viewer>
            </div>

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
                            <li><a href="#home" className="nav-link">Home</a></li>
                            <li><a href="#project" className="nav-link">Project</a></li>
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
        </>
    );
}