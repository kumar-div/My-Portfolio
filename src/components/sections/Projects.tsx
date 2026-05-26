import { useEffect, useRef, useState, useCallback } from 'react';
import { projects } from '../../data/content';
import { MagneticButton } from '../ui/MagneticButton';
import './Projects.css';

export function Projects() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`section projects-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-inner">
        <span className="section-label text-label">My Work</span>
        <h2 className="projects-heading text-heading">
          Featured <span className="gradient-text">Projects</span>
        </h2>

        <div className="projects-grid">
          {projects
            .filter((p) => p.featured)
            .map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -8, y: x * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card"
      style={{
        transitionDelay: `${index * 150 + 200}ms`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="project-image">
        <div className="project-image-placeholder">
          <span className="project-image-letter">
            {project.title.charAt(0)}
          </span>
        </div>
        <div className="project-image-overlay" />
      </div>

      {/* Content */}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tech">
          {project.tech.map((t) => (
            <span key={t} className="project-tech-tag">
              {t}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.liveUrl && (
            <MagneticButton
              variant="ghost"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo ↗
            </MagneticButton>
          )}
          {project.githubUrl && (
            <MagneticButton
              variant="ghost"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </MagneticButton>
          )}
        </div>
      </div>

      {/* Animated border */}
      <div className="project-border-glow" />
    </div>
  );
}
