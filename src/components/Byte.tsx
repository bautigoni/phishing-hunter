import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ByteProps {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  emotion?: 'happy' | 'thinking' | 'celebrate' | 'alert' | 'cool';
  variant?: 'robot' | 'firewall' | 'cat';
}

const SIZE_MAP = { sm: 56, md: 88, lg: 128 } as const;

const EMOTIONS: Record<NonNullable<ByteProps['emotion']>, { eye: string; mouth: string; glow: string; cheek?: boolean }> = {
  happy: { eye: '^ ^', mouth: '◡', glow: '#3eff9b' },
  thinking: { eye: '· ·', mouth: '—', glow: '#00c6ff' },
  celebrate: { eye: '★ ★', mouth: '▽', glow: '#ffe14a', cheek: true },
  alert: { eye: '! !', mouth: '△', glow: '#ff3e6a', cheek: true },
  cool: { eye: '⌐ ⌐', mouth: '⌣', glow: '#9b5cff' }
};

export function Byte({ children, size = 'md', emotion = 'happy', variant = 'robot' }: ByteProps) {
  const px = SIZE_MAP[size];
  const e = EMOTIONS[emotion];
  const emoji = variant === 'firewall' ? '🐕‍🦺' : variant === 'cat' ? '🐱' : '🤖';

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative shrink-0"
        style={{ width: px, height: px }}
      >
        <div
          className="absolute inset-0 rounded-3xl blur-xl opacity-50"
          style={{ background: e.glow }}
        />
        <div
          className="relative w-full h-full rounded-3xl border-2 flex items-center justify-center text-3xl sm:text-4xl"
          style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'linear-gradient(180deg, #1a2240, #0b0f1a)' }}
        >
          <span>{emoji}</span>
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full animate-blink" style={{ background: e.glow }} />
      </motion.div>
      {children && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass px-4 py-3 text-sm leading-relaxed max-w-[14rem] sm:max-w-xs"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
