import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../../data/content';
import './About.css';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState(personalInfo.stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounters(
        personalInfo.stats.map((stat) => Math.round(stat.value * eased))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`section about-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-inner about-inner">
        {/* Section Label */}
        <span className="section-label text-label">About Me</span>

        {/* Heading */}
        <h2 className="about-heading text-heading">
          Passionate about building{' '}
          <span className="about-heading-accent">experiences</span> that matter.
        </h2>

        {/* Bio */}
        <div className="about-bio">
          {personalInfo.bio.map((paragraph, i) => (
            <p
              key={i}
              className="about-paragraph"
              style={{ transitionDelay: `${i * 150 + 300}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Stats */}
        <div className="about-stats">
          {personalInfo.stats.map((stat, i) => (
            <div
              key={i}
              className="about-stat"
              style={{ transitionDelay: `${i * 100 + 600}ms` }}
            >
              <span className="about-stat-value">
                {counters[i]}
                <span className="about-stat-suffix">{stat.suffix}</span>
              </span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
