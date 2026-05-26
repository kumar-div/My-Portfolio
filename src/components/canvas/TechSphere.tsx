import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { techSphereItems } from '../../data/content';

interface TechBall {
  position: THREE.Vector3;
  label: string;
  color: string;
}

const COLORS = [
  '#e8e4dd', '#ff6b35', '#9a9590', '#e8e4dd',
  '#ff8559', '#7a7a7a', '#e8e4dd', '#ff6b35',
];

export function TechSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 8;

  const balls = useMemo<TechBall[]>(() => {
    const count = isMobile ? 12 : techSphereItems.length;
    return techSphereItems.slice(0, count).map((label, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.5;

      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        label,
        color: COLORS[i % COLORS.length],
      };
    });
  }, [isMobile]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {balls.map((ball, i) => (
        <group key={i} position={ball.position}>
          <mesh
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
          >
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={ball.color}
              metalness={0.6}
              roughness={0.3}
              emissive={hoveredIndex === i ? '#ff6b35' : ball.color}
              emissiveIntensity={hoveredIndex === i ? 0.4 : 0.05}
            />
          </mesh>
          {hoveredIndex === i && (
            <Html center distanceFactor={8}>
              <div style={{
                background: 'rgba(12, 12, 12, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '3px 10px',
                borderRadius: '4px',
                color: '#ededed',
                fontSize: '11px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 400,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                letterSpacing: '0.05em',
              }}>
                {ball.label}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
