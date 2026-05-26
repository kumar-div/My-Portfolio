import { useRef, useState, useCallback } from 'react';
import './MagneticButton.css';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  target?: string;
  rel?: string;
}

export function MagneticButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform({ x: x * 0.3, y: y * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  };

  const commonProps = {
    ref: ref as any,
    className: `magnetic-btn ${variant} ${className}`,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    'data-cursor': 'hover',
  };

  if (href) {
    return (
      <a href={href} {...commonProps} target={target} rel={rel}>
        <span className="magnetic-btn-text">{children}</span>
        <span className="magnetic-btn-glow" />
      </a>
    );
  }

  return (
    <button {...commonProps} onClick={onClick}>
      <span className="magnetic-btn-text">{children}</span>
      <span className="magnetic-btn-glow" />
    </button>
  );
}
