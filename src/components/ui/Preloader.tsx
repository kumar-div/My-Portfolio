import { useState, useEffect } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    const increment = () => {
      // Simulate loading with eased progression
      const remaining = 100 - current;
      const step = Math.max(0.5, remaining * 0.08);
      current = Math.min(100, current + step);
      setProgress(Math.round(current));

      if (current < 100) {
        requestAnimationFrame(increment);
      } else {
        // Hold for a moment, then exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    // Small initial delay for drama
    setTimeout(() => requestAnimationFrame(increment), 300);
  }, [onComplete]);

  return (
    <div className={`preloader ${isExiting ? 'exiting' : ''}`}>
      <div className="preloader-content">
        {/* Logo */}
        <div className="preloader-logo">
          <span className="preloader-letter">D</span>
          <span className="preloader-dot">.</span>
        </div>

        {/* Progress Bar */}
        <div className="preloader-bar-track">
          <div
            className="preloader-bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        {/* Percentage */}
        <div className="preloader-info">
          <span className="preloader-label">Loading Experience</span>
          <span className="preloader-percent">{progress}%</span>
        </div>
      </div>

      {/* Exit curtains */}
      <div className="preloader-curtain preloader-curtain-left" />
      <div className="preloader-curtain preloader-curtain-right" />
    </div>
  );
}
