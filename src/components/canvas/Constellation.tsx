import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConstellationProps {
  count?: number;
  connectionDistance?: number;
  mouseX?: number;
  mouseY?: number;
}

export function Constellation({
  count = 60,
  connectionDistance = 2.5,
  mouseX = 0,
  mouseY = 0,
}: ConstellationProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const spread = 12;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i3 + 2] = (Math.random() - 0.5) * 4;

      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions, velocities };
  }, [count]);

  const linePositions = useMemo(
    () => new Float32Array(count * count * 3),
    [count]
  );

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] += velocities[i3] + mouseX * 0.0003;
      posArr[i3 + 1] += velocities[i3 + 1] + mouseY * 0.0003;
      posArr[i3 + 2] += velocities[i3 + 2];

      if (Math.abs(posArr[i3]) > 6) velocities[i3] *= -1;
      if (Math.abs(posArr[i3 + 1]) > 4) velocities[i3 + 1] *= -1;
      if (Math.abs(posArr[i3 + 2]) > 2) velocities[i3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance) {
          linePositions[lineIdx++] = posArr[i * 3];
          linePositions[lineIdx++] = posArr[i * 3 + 1];
          linePositions[lineIdx++] = posArr[i * 3 + 2];
          linePositions[lineIdx++] = posArr[j * 3];
          linePositions[lineIdx++] = posArr[j * 3 + 1];
          linePositions[lineIdx++] = posArr[j * 3 + 2];
        }
      }
    }

    for (let i = lineIdx; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }

    linesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions.slice(0, lineIdx), 3)
    );
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx / 3);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#e8e4dd"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={0}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#e8e4dd"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}
