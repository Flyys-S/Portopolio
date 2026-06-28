import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ContactPage.css';

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [timeStr, setTimeStr] = useState('00:00 AM GMT+7');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Dynamic Jakarta Clock
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

    // Initial page load animations
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero-text > span', {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out'
      });

      gsap.from('.contact-form-group', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3
      });

      gsap.from('.contact-info-block', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
      });

      // Magnetic hover effect for Send Button & Social links
      const magnets = document.querySelectorAll('.magnetic-target');
      magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e: any) => {
          const bound = magnet.getBoundingClientRect();
          const x = e.clientX - bound.left - bound.width / 2;
          const y = e.clientY - bound.top - bound.height / 2;
          gsap.to(magnet, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        magnet.addEventListener('mouseleave', () => {
          gsap.to(magnet, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      });
    }, containerRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    try {
      // Save message to Firestore
      await addDoc(collection(db, 'contacts'), {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        createdAt: new Date()
      });
    } catch (err) {
      console.error('Error saving contact message:', err);
    }

    // Trigger cool submit animation
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => {
        setIsSubmitted(true);
        // Animate success message
        gsap.fromTo('.success-msg-container > *', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
        );
      }
    });
  };

  return (
    <div ref={containerRef} className="contact-page-container">
      {/* Background decoration elements */}
      <div className="contact-bg-grid"></div>
      <div className="contact-glow-orb orb-1"></div>
      <div className="contact-glow-orb orb-2"></div>

      <div className="contact-wrapper">
        {/* Left Column: Title and Details */}
        <div className="contact-info-col">
          <div className="contact-status">
            <span className="pulse-dot"></span>
            <span>AVAILABLE FOR NEW WORK</span>
          </div>

          <h1 className="contact-hero-text">
            <span>LET'S START</span>
            <span>SOMETHING</span>
            <span className="accent-text">NEW.</span>
          </h1>

          <div className="contact-info-details">
            <div className="contact-info-block">
              <span className="info-label">LOCAL TIME</span>
              <span className="info-val">{timeStr}</span>
            </div>

            <div className="contact-info-block">
              <span className="info-label">CURRENT COORDINATES</span>
              <span className="info-val">6.2088° S, 106.8456° E</span>
            </div>

            <div className="contact-info-block">
              <span className="info-label">EMAIL ADDRESS</span>
              <a href="mailto:raflyrajwas@gmail.com" className="info-val interactive-link magnetic-target">
                raflyrajwas@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-social-footer">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="magnetic-target">LINKEDIN</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="magnetic-target">GITHUB</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="magnetic-target">INSTAGRAM</a>
          </div>
        </div>

        {/* Right Column: Form with state-of-the-art styling */}
        <div className="contact-form-col">
          {!isSubmitted ? (
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder=" "
                  value={formState.name}
                  onChange={handleChange}
                />
                <label htmlFor="name">YOUR NAME</label>
                <div className="input-focus-line"></div>
              </div>

              <div className="contact-form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder=" "
                  value={formState.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">YOUR EMAIL</label>
                <div className="input-focus-line"></div>
              </div>

              <div className="contact-form-group">
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  placeholder=" "
                  value={formState.message}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="message">YOUR MESSAGE</label>
                <div className="input-focus-line"></div>
              </div>

              <button
                ref={buttonRef}
                type="submit"
                className="contact-submit-btn magnetic-target"
              >
                <span className="btn-inner">
                  <span className="btn-text">SEND MESSAGE</span>
                  <span className="btn-arrow">↗</span>
                </span>
              </button>
            </form>
          ) : (
            <div className="success-msg-container">
              <div className="success-check-icon">✓</div>
              <h2 className="success-title">MESSAGE SENT SUCCESSFULLY</h2>
              <p className="success-desc">
                Thanks for reaching out! I'll get back to you within 24 hours. Let's make something amazing.
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormState({ name: '', email: '', message: '' });
                }}
                className="reset-btn magnetic-target"
              >
                SEND ANOTHER ONE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
