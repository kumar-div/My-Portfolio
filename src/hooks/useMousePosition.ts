import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafId = useRef<number>(0);
  const latestEvent = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const updatePosition = useCallback(() => {
    const { x, y } = latestEvent.current;
    setPosition({
      x,
      y,
      normalizedX: (x / window.innerWidth) * 2 - 1,
      normalizedY: -(y / window.innerHeight) * 2 + 1,
    });
    rafId.current = 0;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      latestEvent.current = { x: e.clientX, y: e.clientY };
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updatePosition]);

  return position;
}
