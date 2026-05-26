import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  spread?: number;
  size?: number;
  color?: string;
  speed?: number;
}

export function ParticleField({
  count = 150,
  spread = 20,
  size = 0.012,
  color = '#e8e4dd',
  speed = 0.2,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;

      velocities[i3] = (Math.random() - 0.5) * 0.001 * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001 * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.0005 * speed;
    }

    return { positions, velocities };
  }, [count, spread, speed]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = size * (0.3 + Math.random() * 0.7);
    }
    return s;
  }, [count, size]);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const halfSpread = spread / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3];
      arr[i3 + 1] += velocities[i3 + 1];
      arr[i3 + 2] += velocities[i3 + 2];

      if (Math.abs(arr[i3]) > halfSpread) velocities[i3] *= -1;
      if (Math.abs(arr[i3 + 1]) > halfSpread) velocities[i3 + 1] *= -1;
      if (Math.abs(arr[i3 + 2]) > halfSpread * 0.5) velocities[i3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
