import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    return [
      { pos: [-4, 2, -4] as [number, number, number], scale: 0.3, speed: 0.2, type: 'octahedron' },
      { pos: [5, -1, -5] as [number, number, number], scale: 0.25, speed: 0.35, type: 'tetrahedron' },
      { pos: [-3, -3, -3] as [number, number, number], scale: 0.2, speed: 0.3, type: 'icosahedron' },
      { pos: [4, 3, -6] as [number, number, number], scale: 0.28, speed: 0.25, type: 'dodecahedron' },
      { pos: [-5, 0, -7] as [number, number, number], scale: 0.18, speed: 0.4, type: 'octahedron' },
    ];
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      if (!shape) return;
      child.rotation.x = t * shape.speed * 0.3;
      child.rotation.y = t * shape.speed * 0.5;
      child.position.y = shape.pos[1] + Math.sin(t * shape.speed + i) * 0.3;
    });
  });

  const getGeometry = (type: string) => {
    switch (type) {
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[1, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
      default: return <octahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.pos} scale={shape.scale}>
          {getGeometry(shape.type)}
          <meshStandardMaterial
            color="#e8e4dd"
            wireframe
            transparent
            opacity={0.07}
            emissive="#ff6b35"
            emissiveIntensity={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}
