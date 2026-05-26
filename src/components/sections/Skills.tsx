import { useEffect, useRef, useState } from 'react';
import { skills } from '../../data/content';
import './Skills.css';

export function Skills() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`section skills-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-inner">
        <span className="section-label text-label">What I Do</span>
        <h2 className="skills-heading text-heading">
          Technologies & <span className="gradient-text">Expertise</span>
        </h2>

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <div
              key={skill.category}
              className="skill-card glass"
              style={{
                transitionDelay: `${i * 120 + 300}ms`,
                borderLeftColor: skill.color,
              }}
            >
              <div className="skill-card-header">
                <span className="skill-icon">{skill.icon}</span>
                <h3 className="skill-category">{skill.category}</h3>
              </div>
              <div className="skill-tags">
                {skill.items.map((item) => (
                  <span key={item} className="skill-tag">
                    {item}
                  </span>
                ))}
              </div>
              {/* Glow accent */}
              <div
                className="skill-card-glow"
                style={{ background: `${skill.color}10` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
