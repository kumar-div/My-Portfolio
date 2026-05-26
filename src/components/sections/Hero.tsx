import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../../data/content';
import { MagneticButton } from '../ui/MagneticButton';
import './Hero.css';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [letterIndex, setLetterIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentRole = personalInfo.roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (letterIndex < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, letterIndex + 1));
          setLetterIndex((prev) => prev + 1);
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (letterIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, letterIndex - 1));
          setLetterIndex((prev) => prev - 1);
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % personalInfo.roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [letterIndex, isDeleting, roleIndex]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`hero-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="hero-content">
        {/* Top bar — name & availability */}
        <div className="hero-top">
          <span className="hero-tag text-label">Portfolio / 2026</span>
          <div className="hero-availability">
            <span className="availability-dot" />
            <span className="text-label">Available for work</span>
          </div>
        </div>

        {/* Main heading — massive, takes up the screen */}
        <div className="hero-center">
          <h1 className="hero-name text-display">
            <span className="hero-line hero-line-1">
              {personalInfo.name.split('').map((char, i) => (
                <span
                  key={i}
                  className="hero-letter"
                  style={{ animationDelay: `${i * 50 + 300}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Role line */}
          <div className="hero-role-line">
            <div className="hero-divider" />
            <div className="hero-role">
              <span className="hero-role-text">{displayedText}</span>
              <span className="hero-cursor">_</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hero-bottom">
          <p className="hero-description">
            Building production-grade full-stack apps<br />
            with real users, real payments, real impact.
          </p>

          <div className="hero-cta">
            <MagneticButton
              variant="primary"
              onClick={() => {
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See my work
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact
            </MagneticButton>
          </div>

          {/* Scroll indicator */}
          <div className="hero-scroll-indicator">
            <div className="scroll-line">
              <div className="scroll-line-fill" />
            </div>
            <span className="text-label">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
