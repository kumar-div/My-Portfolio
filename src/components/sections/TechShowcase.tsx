import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { TechSphere } from '../canvas/TechSphere';
import { useMobileDetect } from '../../hooks/useMobileDetect';
import './TechShowcase.css';

export function TechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useMobileDetect();

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
      id="tech"
      className={`section tech-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-inner tech-inner">
        <div className="tech-text">
          <span className="section-label text-label">Technologies</span>
          <h2 className="tech-heading text-heading">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="tech-description">
            Hover over the sphere to explore the technologies I work with.
            Each ball represents a tool in my engineering toolkit.
          </p>
        </div>

        <div className="tech-canvas-wrapper">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={0.6} />
              <pointLight position={[-3, 2, 4]} intensity={0.5} color="#8b5cf6" />
              <pointLight position={[3, -2, 4]} intensity={0.3} color="#06b6d4" />
              <TechSphere />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
