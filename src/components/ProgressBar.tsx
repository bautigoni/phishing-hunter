import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0..1
  height?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  pulse?: boolean;
}

export function ProgressBar({
  value,
  height = 10,
  color = 'linear-gradient(90deg, #00c6ff, #9b5cff)',
  trackColor = 'rgba(255,255,255,0.08)',
  showLabel,
  pulse
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-full"
        style={{ height, background: trackColor }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${v * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className={`h-full ${pulse ? 'animate-pulseGlow' : ''}`}
          style={{ background: color }}
        />
        <div className="absolute inset-0 ring-shine opacity-40 pointer-events-none" />
      </div>
      {showLabel && (
        <div className="text-xs text-white/60 mt-1 text-right tabular-nums">{Math.round(v * 100)}%</div>
      )}
    </div>
  );
}
