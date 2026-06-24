import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { findClosestEdge } from '../utils/helpers';
import './FullMenu.css';

interface FullMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: 'home' | 'project' | 'about' | 'contact') => void;
}

interface MenuItemProps {
    text: string;
    marqueeText: string;
    num: string;
    view: 'home' | 'project' | 'about' | 'contact';
    onNavigate: (view: 'home' | 'project' | 'about' | 'contact') => void;
    onClose: () => void;
}

function MenuItem({ text, marqueeText, num, view, onNavigate, onClose }: MenuItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const marqueeInnerRef = useRef<HTMLDivElement>(null);

    const animationDefaults = { duration: 0.6, ease: 'expo.out' };



    const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

        gsap.timeline({ defaults: animationDefaults })
            .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
            .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    };

    const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

        gsap.timeline({ defaults: animationDefaults })
            .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    };

    const handleItemClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigate(view);
        onClose();
    };

    // Render 8 repetitions to ensure it spans across the viewport for all screen sizes
    return (
        <div className="nav-row relative overflow-hidden" ref={itemRef}>
            <a
                href={`#${view}`}
                className="nav-row-text pointer-events-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleItemClick}
            >
                <span className="nav-row-num">{num}</span>
                <span className="nav-row-label">{text}</span>
            </a>
            <div
                className="menu-marquee-container"
                ref={marqueeRef}
                style={{ backgroundColor: '#d39700ff' }}
            >
                <div className="menu-marquee-inner" ref={marqueeInnerRef}>
                    {[...Array(8)].map((_, idx) => (
                        <div className="menu-marquee-part" key={idx} style={{ color: '#ffffff' }}>
                            <span className="menu-marquee-text">
                                {marqueeText}
                            </span>
                            <span className="menu-marquee-arrow">↗</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function FullMenu({ isOpen, onClose, onNavigate }: FullMenuProps) {
    const [localTime, setLocalTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setLocalTime(`${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className={`full-menu-overlay ${isOpen ? 'open' : ''}`}>
            {/* Background grid lines */}
            <div className="grid-lines-container">
                <div className="grid-col-line line-1" />
                <div className="grid-col-line line-2" />
                <div className="grid-col-line line-3" />
                <div className="grid-col-line line-4" />
                <div className="grid-col-line line-5" />
            </div>

            <header className="menu-header">
                <div className="menu-logo-container" onClick={() => { onNavigate('home'); onClose(); }}>
                    <span className="menu-logo-text">RRS</span>
                </div>
                <button className="menu-close-btn" onClick={onClose} aria-label="Close menu">
                    <span className="close-btn-circle">
                        <span className="close-btn-x">×</span>
                    </span>
                </button>
            </header>

            <nav className="menu-nav-links">
                <MenuItem
                    text="ABOUT"
                    marqueeText="GET TO KNOW ME"
                    num="01"
                    view="about"
                    onNavigate={onNavigate}
                    onClose={onClose}
                />
                <MenuItem
                    text="PROJECTS"
                    marqueeText="CREATIVE WORK"
                    num="02"
                    view="project"
                    onNavigate={onNavigate}
                    onClose={onClose}
                />
                <MenuItem
                    text="CONTACT"
                    marqueeText="GET IN TOUCH"
                    num="03"
                    view="contact"
                    onNavigate={onNavigate}
                    onClose={onClose}
                />
            </nav>

            <footer className="menu-footer">
                <div className="footer-col col-bio">
                    <p className="bio-paragraph">
                        My work is driven by clarity, performance, and attention to detail. I focus on creating reliable digital experiences that feel simple, fast, and intentional.
                    </p>
                    <span className="copyright-text">©2026 All Rights Reserved</span>
                </div>

                <div className="footer-col col-empty" />

                <div className="footer-col col-moon">
                    <div className="moon-sphere" />
                </div>

                <div className="footer-col col-contact">
                    <a href="mailto:example@domain.com" className="email-link">example@domain.com</a>
                    <span className="location-text">City, Country</span>
                </div>

                <div className="footer-col col-socials">
                    <div className="socials-links-row">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">instagram</a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">linkedin</a>
                        <a href="https://dribbble.com" target="_blank" rel="noreferrer">dribbble</a>
                    </div>
                    <span className="time-text">Local time — {localTime}</span>
                </div>
            </footer>
        </div>
    );
}
