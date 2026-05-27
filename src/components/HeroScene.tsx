import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ═══ Floating Wireframe Geometry ═══ */

function WireframeTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  const handlePointerMove = (e: any) => {
    mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;

    const targetX = mousePos.current.y * 0.3;
    const targetY = mousePos.current.x * 0.3;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.02;
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', handlePointerMove);
  }

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.4}
      floatIntensity={0.8}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} scale={viewport.width > 10 ? 2.2 : 1.6}>
        <torusKnotGeometry args={[1, 0.35, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#8fbc8b"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function InnerRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.3;
    ringRef.current.rotation.x += delta * 0.1;
  });

  const { viewport } = useThree();

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ringRef} scale={viewport.width > 10 ? 1.8 : 1.3}>
        <torusGeometry args={[1.2, 0.015, 16, 80]} />
        <meshStandardMaterial
          color="#8fbc8b"
          emissive="#8fbc8b"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return { positions };
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8fbc8b"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══ Scene Composition ═══ */

export default function HeroScene() {
  return (
    <div className="hero-3d">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#8fbc8b" />
        <pointLight position={[-3, -2, 4]} intensity={0.3} color="#a2c4a0" />

        <WireframeTorus />
        <InnerRing />
        <Particles />
      </Canvas>
    </div>
  );
}
