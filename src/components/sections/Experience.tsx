import { useEffect, useRef, useState } from 'react';
import { timeline } from '../../data/content';
import './Experience.css';

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={`section experience-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-inner">
        <span className="section-label text-label">Experience</span>
        <h2 className="experience-heading text-heading">
          My <span className="gradient-text">Journey</span>
        </h2>

        <div className="timeline">
          {/* Central line */}
          <div className="timeline-line">
            <div className="timeline-line-fill" />
          </div>

          {timeline.map((entry, i) => (
            <div
              key={i}
              className={`timeline-entry ${i % 2 === 0 ? 'left' : 'right'}`}
              style={{ transitionDelay: `${i * 200 + 300}ms` }}
            >
              {/* Dot */}
              <div className="timeline-dot">
                <div className="timeline-dot-inner" />
                <div className="timeline-dot-pulse" />
              </div>

              {/* Card */}
              <div className="timeline-card glass">
                <span className="timeline-year">{entry.year}</span>
                <h3 className="timeline-title">{entry.title}</h3>
                <span className="timeline-company">{entry.company}</span>
                <p className="timeline-description">{entry.description}</p>
                <ul className="timeline-achievements">
                  {entry.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
