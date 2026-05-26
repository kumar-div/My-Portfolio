import { useScrollProgress } from '../../hooks/useScrollProgress';
import './ScrollProgress.css';

export function ScrollProgress() {
  const { progress } = useScrollProgress();

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
