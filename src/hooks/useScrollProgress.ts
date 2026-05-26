import { useState, useEffect, useRef, useCallback } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);
  const rafId = useRef<number>(0);

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    setProgress(newProgress);
    setDirection(scrollY > lastScrollY.current ? 'down' : 'up');
    lastScrollY.current = scrollY;
    rafId.current = 0;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return { progress, direction };
}
