import { motion } from 'framer-motion';
import { STAT_COLOR, STAT_EMOJI, STAT_LABELS, type StatKey } from '@/data/decisions';
import { ProgressBar } from './ProgressBar';

interface StatBarProps {
  stat: StatKey;
  value: number; // 0..100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showValue?: boolean;
  pulse?: boolean;
}

export function StatBar({ stat, value, size = 'md', showLabel = true, showValue = false, pulse = false }: StatBarProps) {
  const v = Math.max(0, Math.min(100, value));
  const color = STAT_COLOR[stat];
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="text-base leading-none">{STAT_EMOJI[stat]}</span>
            <span>{STAT_LABELS[stat]}</span>
          </span>
          {showValue && <span className="tabular-nums text-white/60">{Math.round(v)}/100</span>}
        </div>
      )}
      <ProgressBar
        value={v / 100}
        height={size === 'sm' ? 6 : size === 'lg' ? 14 : 9}
        color={`linear-gradient(90deg, ${color}, ${color}aa)`}
        pulse={pulse}
      />
    </div>
  );
}

interface StatRadarProps {
  stats: Record<StatKey, number>;
}

import { STAT_KEYS } from '@/data/decisions';

export function StatRadar({ stats }: StatRadarProps) {
  // Visualización tipo "medidor" en fila.
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {STAT_KEYS.map((k) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-3"
        >
          <StatBar stat={k} value={stats[k]} size="sm" showValue />
        </motion.div>
      ))}
    </div>
  );
}
