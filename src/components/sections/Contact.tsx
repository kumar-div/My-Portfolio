import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Constellation } from '../canvas/Constellation';
import { personalInfo, socialLinks } from '../../data/content';
import { MagneticButton } from '../ui/MagneticButton';
import { useMousePosition } from '../../hooks/useMousePosition';
import './Contact.css';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mouse = useMousePosition();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`section contact-section ${isVisible ? 'visible' : ''}`}
    >
      {/* Background constellation */}
      <div className="contact-canvas">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={1}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Constellation
              mouseX={mouse.normalizedX}
              mouseY={mouse.normalizedY}
              count={60}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="section-inner contact-inner">
        <div className="contact-content">
          <span className="section-label text-label">Get In Touch</span>

          <h2 className="contact-heading text-display">
            Let's Build<br />
            Something <span className="gradient-text">Great</span><br />
            Together.
          </h2>

          <p className="contact-description">
            Have a project in mind or just want to chat? I'm always open
            to discussing new opportunities and creative ideas.
          </p>

          <MagneticButton
            variant="primary"
            href={`mailto:${personalInfo.email}`}
          >
            Say Hello →
          </MagneticButton>

          <div className="contact-info">
            <div className="contact-info-item">
              <span className="contact-info-label">Email</span>
              <a href={`mailto:${personalInfo.email}`} className="contact-info-value">
                {personalInfo.email}
              </a>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-label">Location</span>
              <span className="contact-info-value">{personalInfo.location}</span>
            </div>
          </div>

          {/* Mobile socials */}
          <div className="contact-socials">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-text">
            © {new Date().getFullYear()} Divyansh. Crafted with passion.
          </span>
          <span className="footer-tech">
            Built with React, Three.js & GSAP
          </span>
        </div>
      </footer>
    </section>
  );
}
