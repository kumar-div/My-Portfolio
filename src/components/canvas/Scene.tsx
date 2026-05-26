import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import { FloatingGeometry } from './FloatingGeometry';
import { useMobileDetect } from '../../hooks/useMobileDetect';

export function Scene() {
  const { isMobile, isTablet } = useMobileDetect();

  const particleCount = useMemo(() => {
    if (isMobile) return 40;
    if (isTablet) return 80;
    return 150;
  }, [isMobile, isTablet]);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} color="#e8e4dd" />
          <pointLight position={[-5, 2, 3]} intensity={0.15} color="#ff6b35" />
          <pointLight position={[5, -2, 3]} intensity={0.1} color="#e8e4dd" />

          <ParticleField count={particleCount} />
          {!isMobile && <FloatingGeometry />}
        </Suspense>
      </Canvas>
    </div>
  );
}
